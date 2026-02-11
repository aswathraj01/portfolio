gsap.registerPlugin(ScrollTrigger);

/* Reveal Animation */
gsap.utils.toArray(".reveal").forEach((el) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 1,
    scrollTrigger: {
      trigger: el,
      start: "top 80%",
    }
  });
});

/* Counter Animation */
const counters = document.querySelectorAll(".counter");

counters.forEach(counter => {
  const update = () => {
    const target = +counter.getAttribute("data-target");
    const count = +counter.innerText;
    const increment = target / 200;

    if (count < target) {
      counter.innerText = Math.ceil(count + increment);
      setTimeout(update, 10);
    } else {
      counter.innerText = target;
    }
  };

  ScrollTrigger.create({
    trigger: counter,
    start: "top 80%",
    onEnter: update
  });
});
