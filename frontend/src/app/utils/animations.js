const ANIMATION_DURATION = "0.3s";
const ANIMATION_EASING = "ease-out";

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

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes scaleOut {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.95);
    }
  }

  .animate-slide-up-fade-in {
    animation: slideUpFadeIn ${ANIMATION_DURATION} ${ANIMATION_EASING} forwards;
  }

  .animate-slide-up-fade-out {
    animation: slideUpFadeOut ${ANIMATION_DURATION} ${ANIMATION_EASING} forwards;
  }

  .animate-fade-in {
    animation: fadeIn ${ANIMATION_DURATION} ${ANIMATION_EASING} forwards;
  }

  .animate-fade-out {
    animation: fadeOut ${ANIMATION_DURATION} ${ANIMATION_EASING} forwards;
  }

  .animate-scale-in {
    animation: scaleIn ${ANIMATION_DURATION} ${ANIMATION_EASING} forwards;
  }

  .animate-scale-out {
    animation: scaleOut ${ANIMATION_DURATION} ${ANIMATION_EASING} forwards;
  }
`;
