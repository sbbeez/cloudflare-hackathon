import { askMeAnythingApi } from "@/service";
import { Button, Input } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default () => {
  const [question, setQuestion] = useState("");
  const [answerLoadingState, setAnswerLoadingState] = useState("idle");
  const [answer, setAnswer] = useState("");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const onAskQuestion = async () => {
    if (!question) {
      return;
    }
    setAnswerLoadingState("loading");
    const answer = await askMeAnythingApi(question, userId!);
    console.log(answer);
    setAnswer(answer.response);
    setAnswerLoadingState("success");
  };

  return (
    <div className="flex w-screen h-screen overflow-y-auto flex-col gap-5 font-mono items-center justify-center text-center">
      <img src="/qa-empty.svg" width={300} height={300} />
      <h1 className="text-5xl font-bold">Ask Questions</h1>
      {answer ? (
        <p className="text-center text-balance text-xl font-bold lg:w-[50%] w-[80%] p-3 bg-slate-100 rounded-xl">
          {answer}
        </p>
      ) : (
        <p className="text-center text-balance font-extralight lg:w-[30%] w-[80%]">
          Hello I'm your personal assitant, I have knowledge of all the data set
          you entered, Now you can ask me a question, I will probably be able to
          help you answer all the questions.
        </p>
      )}

      <Input
        placeholder="What are the symptoms?"
        autoFocus
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        className="lg:max-w-[30%] max-w-[80%] max-md:py-3"
      />
      <div className="flex gap-3 m-5 flex-wrap justify-center">
        <Button
          onClick={() => {
            navigate("/data-source");
          }}
          variant="outline"
          colorScheme="blue"
        >
          ⬅️ Back to Data Source
        </Button>
        <Button
          onClick={onAskQuestion}
          variant="solid"
          colorScheme="blue"
          isLoading={answerLoadingState === "loading"}
        >
          💬 Ask Your Question
        </Button>
      </div>
    </div>
  );
};
