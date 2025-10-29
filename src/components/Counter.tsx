'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { increment, decrement, incrementByAmount } from '@/store/slices/exampleSlice';

export default function Counter() {
  const count = useAppSelector((state) => state.example.value);
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col items-center gap-4 p-8 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold">Redux Counter Example</h2>
      <div className="text-4xl font-bold">{count}</div>
      <div className="flex gap-2">
        <button
          onClick={() => dispatch(decrement())}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Decrement
        </button>
        <button
          onClick={() => dispatch(increment())}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Increment
        </button>
        <button
          onClick={() => dispatch(incrementByAmount(5))}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          +5
        </button>
      </div>
    </div>
  );
}
