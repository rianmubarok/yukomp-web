export const animationStyles = `
  @keyframes slideUpAndFadeOut {
    0% {
      transform: translateY(0);
      opacity: 1;
    }
    100% {
      transform: translateY(-100%);
      opacity: 0;
    }
  }

  @keyframes slideUpAndFadeIn {
    0% {
      transform: translateY(100%);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .animate-slide-up-fade-out {
    animation: slideUpAndFadeOut 0.3s ease-out forwards;
  }

  .animate-slide-up-fade-in {
    animation: slideUpAndFadeIn 0.3s ease-out forwards;
  }
`;
