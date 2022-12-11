// Simples animation for cards

const observer = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("in-view");
    }
  });
});

let transitionDelayTime = 0;

export const animateCards = (cards) => {
  // Observing each card and adding delay
  cards.forEach((card) => {
    card.style.transitionDelay = `${transitionDelayTime}ms`

    observer.observe(card);
    transitionDelayTime += 200;

  });
  transitionDelayTime = 0;
};
