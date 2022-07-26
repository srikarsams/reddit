const observeTargetElement = (element: Element, callback: () => {}) => {
  if (!element) return;
  console.log('heelo');
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        observer.unobserve(element);
        callback();
      }
    },
    { threshold: 1 }
  );
  observer.observe(element);
};

export { observeTargetElement };
