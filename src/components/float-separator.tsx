import React from "react";

type Props = {
  placeholder: string;
};

const FloatSeparator: React.FC<Props> = ({ placeholder }) => {
  return (
    <div className="flex items-center gap-5 mb-3 mt-5">
      <p className="font-semibold min-w-max">{placeholder}</p>
      <div className="h-[1px] bg-gray-200 dark:bg-muted w-full"></div>
    </div>
  );
};

export default FloatSeparator;
