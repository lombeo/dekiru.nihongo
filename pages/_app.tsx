import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { ConfirmationModal } from "@edn/components/ModalConfirm";
import AppNotification from "@edn/components/Notify/AppNotification";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { getAccessToken } from "@src/api/axiosInstance";
import Chat from "@src/components/Chat";
import ErrorBoundary from "@src/components/ErrorBoundary";
import Progress from "@src/components/Layout/Header/Progress";
import { ShareContextProvider } from "@src/components/Share/ShareContext";
import { msalConfig } from "@src/config/microsoft.config";
import useFetchCountCart from "@src/hooks/useCart/useFetchCountCart";
import useJwtToken from "@src/hooks/useJwtToken";
import theme from "@src/mantine.theme";
import { wrapper } from "@src/store/store";
import { HydrationBoundary, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import "dayjs/locale/vi";
import mixpanel from "mixpanel-browser";
import { appWithTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Script from "next/script";
import React, { useEffect, useState } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { MixpanelProvider } from "react-mixpanel";
import { Provider } from "react-redux";
import "react-tooltip/dist/react-tooltip.css";
import "../styles/globals.scss";

const msalInstance = new PublicClientApplication(msalConfig);

const ReactQueryDevtoolsProduction = React.lazy(() =>
  import("@tanstack/react-query-devtools/build/modern/production.js").then((d) => ({
    default: d.ReactQueryDevtools,
  }))
);

const App = ({ Component, ...rest }: any) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;

  const [showDevtools, setShowDevtools] = useState(false);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  const router = useRouter();
  const { pathname, asPath, query } = router;

  useEffect(() => {
    dayjs.locale(router.locale ?? "en");
    const localizedFormat = require("dayjs/plugin/localizedFormat");
    dayjs.extend(localizedFormat);
  }, [router.locale]);

  useEffect(() => {
    (window as any).toggleDevtools = () => setShowDevtools((old) => !old);
    try {
      if (process.env.NEXT_PUBLIC_MIXPANEL_KEY) {
        mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_KEY, { batch_requests: true, persistence: "localStorage" });
      }
    } catch (e) {}
    const locale = localStorage.getItem("locale") || "vi";
    localStorage.setItem("locale", locale);
    router.push({ pathname, query }, asPath, { locale });
  }, []);

  return (
    <ErrorBoundary>
      {process.env.NEXT_PUBLIC_ENVNAME === "production" && (
        <>
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}`}
            strategy="lazyOnload"
            crossOrigin="anonymous"
          />
          <Script src="https://www.googletagmanager.com/gtag/js?id=G-KXZ034RWSB" strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-KXZ034RWSB');
        `}
          </Script>
          <Script id="meta-pixel">
            {`!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1917703958679442');
            fbq('track', 'PageView');`}
          </Script>
          <Script id="gtm" strategy="afterInteractive">
            {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-TCH4FKV8');
      `}
          </Script>
        </>
      )}
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TCH4FKV8" height="0" width="0" style="display: none; visibility: hidden;" />`,
        }}
      />
      <Provider store={store}>
        <Progress />
        <Notifications position="top-right" zIndex={2077} />
        <AppProvider />
        <QueryClientProvider client={queryClient}>
          <HydrationBoundary state={pageProps.dehydratedState}>
            <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
              <ShareContextProvider>
                <MixpanelProvider mixpanel={mixpanel}>
                  <GoogleReCaptchaProvider
                    reCaptchaKey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}
                    scriptProps={{
                      async: false,
                      defer: false,
                      appendTo: "head",
                      nonce: undefined,
                    }}
                    container={{
                      parameters: {
                        badge: "bottomright",
                        theme: "light",
                      },
                    }}
                  >
                    <MsalProvider instance={msalInstance}>{<Component {...pageProps} />}</MsalProvider>
                    <Chat />
                  </GoogleReCaptchaProvider>
                </MixpanelProvider>
              </ShareContextProvider>
            </MantineProvider>
            {showDevtools && (
              <React.Suspense fallback={null}>
                <ReactQueryDevtoolsProduction />
              </React.Suspense>
            )}
          </HydrationBoundary>
        </QueryClientProvider>
        <ConfirmationModal />
        <AppNotification />
      </Provider>
    </ErrorBoundary>
  );
};
export default appWithTranslation(App);

const AppProvider = () => {
  const token = getAccessToken();
  const loadProfile = useJwtToken();

  const fetchCountCart = useFetchCountCart();

  useEffect(() => {
    loadProfile();
    fetchCountCart();
  }, [token]);

  return null;
};
