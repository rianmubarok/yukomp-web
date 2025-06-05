export const animationStyles = `
  @keyframes slideUpFadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideUpFadeOut {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-20px);
    }
  }

  .animate-slide-up-fade-in {
    animation: slideUpFadeIn 0.3s ease-out forwards;
  }

  .animate-slide-up-fade-out {
    animation: slideUpFadeOut 0.3s ease-out forwards;
  }
`;
