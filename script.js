const tutors = {
  math: {
    avatar: "M",
    title: "Proof Coach",
    subtitle: "Socratic proof-builder",
    color: "#16a6a3",
    response:
      "Good. Let's keep the formula closed for a moment. What quantity is changing, what stays fixed, and what relationship connects them?",
    method: "Guided questions, pattern spotting, then a worked example."
  },
  programming: {
    avatar: "P",
    title: "Debug Partner",
    subtitle: "Debug-first pair guide",
    color: "#ed6a5a",
    response:
      "Let's trace it from the failing line outward. What value did you expect there, and what value did the program actually produce?",
    method: "Error reading, trace maps, and small testable fixes."
  },
  biology: {
    avatar: "B",
    title: "Systems Guide",
    subtitle: "Visual systems coach",
    color: "#5aa469",
    response:
      "Picture it as a relay. One molecule passes a signal, the next changes shape, and the cell turns that tiny event into a visible response.",
    method: "Diagrams, analogies, and vocabulary hooks."
  },
  physics: {
    avatar: "F",
    title: "Lab Mentor",
    subtitle: "Concept-first lab partner",
    color: "#4d8de8",
    response:
      "Before numbers, draw the situation. Which forces are acting, which direction is acceleration, and what would you observe in a real lab?",
    method: "Free-body reasoning, units, and concept checks."
  },
  economics: {
    avatar: "E",
    title: "Market Analyst",
    subtitle: "Real-world tradeoff analyst",
    color: "#f2b84b",
    response:
      "Start with incentives. Who changes behavior when the price moves, what tradeoff do they face, and where would the pressure show on the graph?",
    method: "Cases, incentives, and supply-demand tradeoff drills."
  }
};

const buttons = document.querySelectorAll(".selector-button");
const avatar = document.querySelector("#chat-avatar");
const title = document.querySelector("#chat-title");
const subtitle = document.querySelector("#chat-subtitle");
const response = document.querySelector("#chat-response");
const method = document.querySelector("#chat-method");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const tutor = tutors[button.dataset.tutor];

    buttons.forEach((item) => {
      item.classList.toggle("is-active", item === button);
      item.setAttribute("aria-selected", item === button ? "true" : "false");
    });

    avatar.textContent = tutor.avatar;
    avatar.style.backgroundColor = tutor.color;
    title.textContent = tutor.title;
    subtitle.textContent = tutor.subtitle;
    response.textContent = tutor.response;
    method.textContent = tutor.method;
  });
});
