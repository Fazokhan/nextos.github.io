document.addEventListener("DOMContentLoaded", () => {
  const stacks = document.querySelectorAll(".card-stack");

  stacks.forEach(stack => {
    stack.addEventListener("click", () => {
      const cards = stack.querySelectorAll(".card-item");
      if (cards.length < 2) return;

      const topCard = cards[0];

      // Animate top card out
      topCard.style.transition = "transform 0.3s ease, opacity 0.2s ease";
      topCard.style.transform = "translateY(-120%) scale(1.05)";
      topCard.style.opacity = "0";

      setTimeout(() => {
        // Reset position and move to end
        topCard.style.transition = "none";
        topCard.style.transform = "none";
        topCard.style.opacity = "1";
        stack.appendChild(topCard);

        // Force reflow
        void topCard.offsetWidth;

        // Reapply stacking transforms
        const newCards = stack.querySelectorAll(".card-item");
        newCards.forEach((card, i) => {
          card.style.zIndex = newCards.length - i;
          card.style.transform = `translateY(${i * 10}px) scale(${1 - i * 0.03})`;
        });
      }, 300);
    });
  });
});