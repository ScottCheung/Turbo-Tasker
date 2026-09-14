import Sidebar from "@/components/Sidebar";
import type { Assessment } from "@/types/assessment";

type TaskBlock =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] };

function taskBlocks(markdown: string): TaskBlock[] {
  const blocks: TaskBlock[] = [];
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: "paragraph", text: paragraph.join(" ") });
    paragraph = [];
  };
  const flushList = () => {
    if (list) blocks.push({ type: "list", ...list });
    list = null;
  };

  for (const line of lines) {
    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    const unorderedItem = /^[-*+]\s+(.+)$/.exec(line);
    const orderedItem = /^\d+[.)]\s+(.+)$/.exec(line);

    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading", level: heading[1].length as 1 | 2 | 3, text: heading[2] });
    } else if (unorderedItem || orderedItem) {
      flushParagraph();
      const ordered = Boolean(orderedItem);
      const text = (unorderedItem ?? orderedItem)![1];
      if (!list || list.ordered !== ordered) {
        flushList();
        list = { ordered, items: [] };
      }
      list.items.push(text);
    } else if (!line.trim()) {
      flushParagraph();
      flushList();
    } else {
      flushList();
      paragraph.push(line.trim());
    }
  }

  flushParagraph();
  flushList();
  return blocks;
}

function MarkdownText({ text }: { text: string }) {
  const fragments = text.split(/(`[^`]+`)/g);
  return (
    <>
      {fragments.map((fragment, index) =>
        fragment.startsWith("`") && fragment.endsWith("`") ? (
          <code key={index} className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] text-accent">
            {fragment.slice(1, -1)}
          </code>
        ) : (
          fragment
        )
      )}
    </>
  );
}

export default function TaskApp({ task, assessment }: { task: string; assessment: Assessment }) {
  const blocks = taskBlocks(task);

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex min-h-[72px] max-w-[1728px] items-center px-5 py-3 lg:px-8">
          <div className="min-w-0">
            <p className="truncate text-[clamp(0.98rem,0.84rem+0.35vw,1.2rem)] font-semibold text-ink">Flash-sale platform design</p>
            <p className="text-[clamp(0.68rem,0.58rem+0.15vw,0.82rem)] font-bold uppercase tracking-[0.16em] text-muted">Original assessment prompt</p>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1728px] flex-col overflow-x-clip lg:flex-row">
        <Sidebar
          sections={assessment.sections}
          activeSection=""
          activeView="task"
        />
        <main className="min-w-0 flex-1 overflow-x-clip px-5 py-10 lg:px-12 lg:py-16 xl:px-16">
          <article className="mx-auto max-w-[900px] rounded-xl border border-line bg-white px-6 py-8 shadow-panel sm:px-10 sm:py-12">
          <p className="mb-5 text-[clamp(0.7rem,0.62rem+0.15vw,0.84rem)] font-bold uppercase tracking-[0.2em] text-accent">Assessment brief</p>
          <div className="space-y-5 text-[clamp(1rem,0.92rem+0.22vw,1.18rem)] leading-[1.75] text-ink">
            {blocks.map((block, index) => {
              if (block.type === "heading") {
                const Tag = block.level === 1 ? "h1" : block.level === 2 ? "h2" : "h3";
                const size = block.level === 1 ? "text-[clamp(1.8rem,1.4rem+1vw,2.5rem)]" : "text-[clamp(1.25rem,1.08rem+0.4vw,1.6rem)]";
                return <Tag key={index} className={`${size} pt-3 font-semibold tracking-[-0.025em] text-ink`}><MarkdownText text={block.text} /></Tag>;
              }

              if (block.type === "list") {
                const List = block.ordered ? "ol" : "ul";
                return (
                  <List key={index} className={`space-y-3 pl-6 marker:text-accent ${block.ordered ? "list-decimal" : "list-disc"}`}>
                    {block.items.map((item, itemIndex) => <li key={itemIndex}><MarkdownText text={item} /></li>)}
                  </List>
                );
              }

              return <p key={index}><MarkdownText text={block.text} /></p>;
            })}
          </div>
          </article>
        </main>
      </div>
    </div>
  );
}
