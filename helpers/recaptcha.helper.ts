const recaptcha = {
  show: () => {
    const element = document.getElementsByClassName("grecaptcha-badge")?.[0] as any;
    if (!element) return;

    element.style.visibility = "visible";
    element.style.opacity = 1;
  },
  hidden: () => {
    const element = document.getElementsByClassName("grecaptcha-badge")?.[0] as any;
    if (!element) return;

    element.style.visibility = "hidden";
    element.style.opacity = 0;
  },
};

export default recaptcha;
