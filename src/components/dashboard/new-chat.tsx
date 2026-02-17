"use client";

import { ArrowRight } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

export default function NewChat() {
  return (
    <section className="w-full h-[90vh] flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto">
        <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center">
          How can I help you?
        </h2>
        <div className="group w-full relative max-h-40">
          <Textarea
            className="rounded-2xl max-h-40 w-full"
            placeholder="Ask me anything!"
            cols={3}
          />
          <button className="absolute bottom-1 right-1 cursor-pointer">
            <ArrowRight
              size={28}
              className="bg-black rounded-full p-1.5  text-white"
            />
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {["Weather in Delhi", "Next F1 race", "AAPL stock price"].map((q) => (
            <Button
              key={q}
              // onClick={() => handleSend(q)}
              variant={"outline"}
              size={"sm"}
              className="shadow-none rounded-full"
            >
              {q}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
