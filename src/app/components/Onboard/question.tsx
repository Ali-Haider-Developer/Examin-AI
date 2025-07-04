import React from "react";

type QuestionProps = {
  question: {
    id: number;
    text: string;
    options: string[];
  };
  selectedAnswer?: string;
  onSelectAnswer: (answer: string) => void;
};

const Question: React.FC<QuestionProps> = ({ question, selectedAnswer, onSelectAnswer }) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-medium mb-2">{question.text}</h2>
      <div className="flex flex-col space-y-2">
        {question.options.map((option) => (
          <label
            key={option}
            className={`px-4 py-2 border rounded cursor-pointer transition ${
              selectedAnswer === option ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={option}
              checked={selectedAnswer === option}
              onChange={() => onSelectAnswer(option)}
              className="hidden"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

export default Question;
