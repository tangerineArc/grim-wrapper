"use client";

import type { Chat } from "@/types/chat";

import { useState } from "react";

import ChatInput from "./ChatInput";

const longText = `Whether Werner Heisenberg was "evil" is a complex and hotly debated question, with no easy answer. It depends on your definition of "evil" and how you weigh his actions and motivations within the context of Nazi Germany. Here's a breakdown of the arguments: **Arguments against Heisenberg being evil (or reasons for understanding his actions):** * **Staying in Germany:** He chose to remain in Germany during the Nazi regime, which some see as a patriotic act and a desire to preserve German science. He may have felt a responsibility to protect his students and colleagues. Leaving would have been a personal safety net, but would have also deprived German science of one of its leading figures. * **No direct evidence of Nazi sympathies:** There's no conclusive evidence that Heisenberg was a fervent supporter of the Nazi regime. He even faced scrutiny and suspicion from the SS at one point due to his association with "degenerate" physics (i.e., Einstein's theories). * **Ambiguous role in the German nuclear program:** The extent to which Heisenberg genuinely worked to develop a nuclear weapon for Germany is highly debated. Some argue that he deliberately slowed down or sabotaged the project, while others believe he simply lacked the technical expertise or resources to succeed. His own post-war accounts are often contradictory and self-serving. * **Uncertainty and survival:** Living under a totalitarian regime forced people into difficult compromises. Heisenberg may have made morally questionable decisions simply to survive and protect himself and his family. The pressure to conform and demonstrate loyalty was immense. * **Post-war actions:** He played a key role in rebuilding German science after the war and advocated for international cooperation. **Arguments suggesting Heisenberg was morally compromised (or reasons for questioning his actions):** * **Working on the nuclear program:** Even if he didn't actively try to build a bomb, he still participated in a project that, if successful, could have resulted in a devastating weapon for the Nazi regime. His involvement, regardless of his intentions, contributed to the regime's war effort. * **Possible lack of resistance:** Critics argue that he could have done more to resist the Nazi regime, even if subtly. He could have used his influence to protect Jewish scientists or publicly distanced himself from Nazi ideology. * **Self-preservation over morality:** Some believe that his primary motivation was self-preservation and career advancement, even if it meant compromising his moral principles. * **Justification of his actions:** His post-war attempts to justify his actions and present himself as a reluctant participant have been criticized as attempts to whitewash his past. * **Ethical concerns of atomic research under the Nazi regime:** Participating in scientific research which may have been used to create devastating weaponry for the Nazi regime, itself an evil entity, can be seen as inherently evil. **Conclusion:** It's difficult to definitively label Heisenberg as "evil." He was a complex figure operating in extraordinarily difficult circumstances. He was undoubtedly a brilliant physicist, but his actions during the Nazi era remain a source of controversy. Instead of a simple "yes" or "no" answer, it's more accurate to say that his actions were morally ambiguous and open to interpretation. His legacy is forever tainted by his involvement in the German nuclear program and the ethical questions it raises. Whether he was a pragmatic survivor, a secret resistor, or a willing participant in the Nazi war effort is a question that continues to be debated by historians and scientists alike. To form your own informed opinion, it's essential to research the available evidence, consider the historical context, and grapple with the complexities of moral decision-making in times of extreme duress. Consider exploring sources like: * **"Heisenberg's War: The Secret History of the German Bomb" by Thomas Powers:** A Pulitzer Prize-winning book that argues Heisenberg deliberately slowed down the German atomic program. * **"Hitler's Uranium Club: The Secret Recordings at Farm Hall" by Jeremy Bernstein:** Transcripts of conversations among German scientists, including Heisenberg, after their capture by Allied forces. * **"Uncertainty: The Life and Science of Werner Heisenberg" by David Cassidy:** A comprehensive biography that examines Heisenberg's life and work in detail. `;

export default function Arena() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");

  const handleNewChat = async () => {
    const response = await fetch("/api/ai/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, model: "gemini-2.0-flash" }),
    });

    setPrompt("");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let result = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      result += decoder.decode(value, { stream: true });
      setReply(result);
    }
  };

  const handlePromptChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPrompt(event.target.value);
  };

  return (
    <main className="flex-1 px-8 flex flex-col justify-between">
      <div>{reply}</div>
      <ChatInput
        prompt={prompt}
        promptChangeHandler={handlePromptChange}
        newChatHandler={handleNewChat}
      />
    </main>
  );
}
