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

export const animateHomeTitle = () => {
  const text = "Weather Dashboard".split('');
  transitionDelayTime = 0;
  text.forEach(letter=>{
    $('#home-title').append(`<span class="animate">${letter}</span>`)
  })
  let els = $('#home-title').children();
    els.each(index=>{
      console.log(els[index])
      els[index].style.transitionDelay = `${transitionDelayTime}ms`;
      transitionDelayTime += 80
    })
  const allLetters = document.querySelectorAll('.animate');
  allLetters.forEach(letter=>{
    observer.observe(letter);
  })
  transitionDelayTime = 0;
}