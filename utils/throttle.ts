let old: NodeJS.Timeout | null;
export function throttle(input: string, callback: (i: string) => void) {
  const timeOut = setTimeout(() => {
    clearInterval(timeOut);
    old = null;
    callback(input);
  }, 300);
  if (old) clearTimeout(old);
  old = timeOut;
}
