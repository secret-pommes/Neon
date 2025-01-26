class Log {
  public info = (c: string | unknown | any): void => console.log(`[INFO] ${c}`);
  public warn = (c: string | unknown | any): void => console.log(`[WARN] ${c}`);
  public error = (c: string | unknown | any): void => console.log(`[ERROR] ${c}`);
}

export default new Log();
