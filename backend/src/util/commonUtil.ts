class CommonUtil {
  static textColor(text: string, color: string): string {
    const colorCodes: { [key: string]: string } = {
      red: "\x1b[31m",
      green: "\x1b[32m",
      yellow: "\x1b[33m",
      blue: "\x1b[34m",
      magenta: "\x1b[35m",
      cyan: "\x1b[36m",
    };
    const escapeCode = colorCodes[color.toLowerCase()] || "\x1b[0m";
    return escapeCode ? `${escapeCode}${text}\x1b[0m` : text;
  };
}

export default CommonUtil;