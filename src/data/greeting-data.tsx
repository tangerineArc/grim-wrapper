import { Code, GraduationCap, Sparkles, Telescope } from "lucide-react";

export const greetingData = [
  {
    category: "Create",
    icon: <Sparkles />,
    items: [
      "Write a short story about a robot discovering emotions",
      "Help me outline a sci-fi novel set in a post-apocalyptic world",
      "Create a character profile for a complex villain with sympathetic motives",
      "Give me 5 creative writing prompts for flash fiction",
    ],
  },
  {
    category: "Explore",
    icon: <Telescope />,
    items: [
      "Good books for fans of Rick Rubin",
      "Countries ranked by number of corgis",
      "Most successful companies in the world",
      "How much does Claude cost?",
    ],
  },
  {
    category: "Code",
    icon: <Code />,
    items: [
      "Write code to invert a binary search tree in python",
      "What's the difference between Promise.all and Promise.allSettled?",
      "Explain React's useEffect cleanup function",
      "Best practices for error handling in async/await",
    ],
  },
  {
    category: "Learn",
    icon: <GraduationCap />,
    items: [
      "Beginner's guide to TypeScript",
      "Explain the CAP theorem in distributed systems",
      "Why is AI so expensive?",
      "Are black holes real?",
    ],
  },
];
