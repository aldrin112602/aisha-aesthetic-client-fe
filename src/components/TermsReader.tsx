import { useEffect, useId, useRef, useState } from 'react';

export default function TermsReader({ title, sections, onReviewed, disabled = false }: {
  title: string;
  sections: { title: string; text: string }[];
  onReviewed: () => void;
  disabled?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const headingId = useId();
  const [atEnd, setAtEnd] = useState(false);

  const checkEnd = () => {
    const element = content.current;
    if (dialog.current?.open && element && element.clientHeight > 0 &&
      element.scrollTop + element.clientHeight >= element.scrollHeight - 4) {
      setAtEnd(true);
    }
  };

  useEffect(() => {
    const observer = new ResizeObserver(checkEnd);
    if (content.current) observer.observe(content.current);
    return () => observer.disconnect();
  }, []);

  function openTerms() {
    setAtEnd(false);
    dialog.current?.showModal();
    if (content.current) content.current.scrollTop = 0;
    requestAnimationFrame(checkEnd);
    content.current?.focus();
  }

  return <>
    <button type="button" disabled={disabled} onClick={openTerms}
      className="text-left font-semibold text-[#d77992] underline underline-offset-4 disabled:opacity-50">
      Read the {title}
    </button>
    <dialog ref={dialog} aria-labelledby={headingId}
      className="m-auto w-[calc(100%-2rem)] max-w-2xl rounded-2xl border border-pink-100 bg-white p-0 text-[#4b343b] shadow-xl backdrop:bg-black/40">
      <div className="border-b border-pink-100 px-5 py-4 sm:px-6">
        <h2 id={headingId} className="text-xl font-bold">{title}</h2>
        <p className="mt-1 text-sm text-[#80656d]">Read to the end, then select “Done reading” to unlock the agreement checkbox.</p>
      </div>
      <div ref={content} onScroll={checkEnd} tabIndex={0} role="region" aria-label="Terms content"
        className="max-h-[50vh] space-y-4 overflow-y-auto px-5 py-5 text-sm leading-6 outline-offset-[-3px] sm:px-6">
        {sections.map(section => <section key={section.title}>
          <h3 className="font-semibold">{section.title}</h3>
          <p className="mt-1 text-[#80656d]">{section.text}</p>
        </section>)}
        <p className="text-xs font-semibold text-[#92737c]">End of Terms & Conditions</p>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-pink-100 px-5 py-4 sm:px-6">
        <button type="button" onClick={() => dialog.current?.close()} className="rounded-xl border border-pink-200 px-4 py-2 text-sm">Close</button>
        <button type="button" disabled={!atEnd} onClick={() => {
          if (!atEnd) return;
          onReviewed();
          dialog.current?.close();
        }} className="primary-btn disabled:cursor-not-allowed disabled:opacity-40">Done reading</button>
      </div>
    </dialog>
  </>;
}
