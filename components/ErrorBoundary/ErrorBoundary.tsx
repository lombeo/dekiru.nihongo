import React from "react";
import { withTranslation } from "next-i18next";
import { WithTranslation } from "react-i18next";
import { Text } from "@edn/components";

interface IErrorBoundaryProps extends WithTranslation {
  readonly children: JSX.Element | JSX.Element[];
}

interface IErrorBoundaryState {
  readonly error: any;
  readonly errorInfo: any;
  readonly timeLeft: number;
  readonly intervalId: any;
}

class ErrorBoundary extends React.Component<IErrorBoundaryProps, IErrorBoundaryState> {
  readonly state: IErrorBoundaryState = { error: undefined, errorInfo: undefined, timeLeft: 3, intervalId: null };

  componentDidCatch(error: any, errorInfo: any) {
    const intervalId = setInterval(() => {
      if (this.state.timeLeft < 0) {
        clearInterval(intervalId);
        location.href = "/";
        return;
      }
      this.setState({ timeLeft: this.state.timeLeft - 1 });
    }, 1000);
    this.setState({
      error,
      errorInfo,
      timeLeft: 3,
      intervalId,
    });
  }

  componentWillUnmount() {
    // use intervalId from the state to clear the interval
    clearInterval(this.state.intervalId);
  }

  render() {
    const { t } = this.props;
    const { errorInfo, timeLeft } = this.state;
    if (errorInfo) {
      return (
        <div className="flex justify-center flex-auto bg-white">
          <div className="pt-16 flex flex-col items-center text-[#4b4b62]">
            <Text className="text-[2.375rem]">Woops!</Text>
            <Text className="text-[2.375rem]">Something went wrong :(</Text>
            <div className={`mt-10 font-semibold text-blue-pressed ${timeLeft < 0 ? "hidden" : ""}`}>
              {t("Redirect to home page in") as string}&nbsp;
              {timeLeft}
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default withTranslation()(ErrorBoundary);
