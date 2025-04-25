
import React from "react";

interface TabContentProps {
  content: string;
  isVisible: boolean;
  contentRef: React.RefObject<HTMLDivElement>;
  emptyMessage: string;
}

const TabContent: React.FC<TabContentProps> = ({ 
  content, 
  isVisible, 
  contentRef, 
  emptyMessage 
}) => {
  return (
    <div 
      className={`p-6 ${isVisible ? "block" : "hidden"}`}
      style={{ minHeight: "500px" }}
    >
      {content ? (
        <div 
          ref={contentRef}
          className="prose prose-headings:font-semibold prose-headings:text-slate-900 dark:prose-headings:text-slate-100
            prose-p:text-slate-700 dark:prose-p:text-slate-300
            prose-p:leading-tight prose-p:my-2
            prose-li:text-slate-700 dark:prose-li:text-slate-300
            prose-strong:text-slate-900 dark:prose-strong:text-white
            prose-ul:my-2 prose-ol:my-2 prose-li:my-1
            prose-h2:text-xl prose-h3:text-lg prose-h2:mt-4 prose-h3:mt-3
            max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <p className="text-muted-foreground text-center py-6">
          {emptyMessage}
        </p>
      )}
    </div>
  );
};

export default TabContent;
