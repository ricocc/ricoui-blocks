import { AsciiBackground } from "../../../registry/ascii-background";

import { useSiteTheme } from "../site/theme-toggle";

export default function AsciiBackgroundPreview() {
  const theme = useSiteTheme();
  return <AsciiBackground theme={theme} style={{ height: 360 }} />;
}
