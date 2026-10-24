"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-gray-600">We couldn&apos;t load anime right now. Please try again.</p>
      <button onClick={reset} className="mt-4 rounded bg-black px-4 py-2 text-white">
        Try again
      </button>
    </main>
  );
}
