export default function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <figure className="my-8 border-l-4 border-brand-500 bg-brand-50/60 py-5 pl-6 pr-5 sm:pl-8">
      <blockquote className="text-lg font-medium leading-relaxed text-brand-900 sm:text-xl sm:leading-relaxed">
        {children}
      </blockquote>
    </figure>
  );
}
