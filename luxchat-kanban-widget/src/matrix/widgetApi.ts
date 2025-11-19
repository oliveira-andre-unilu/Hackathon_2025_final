import { useEffect, useState } from "react";
import {
  createWidgetApi,
  WidgetApi,
  WidgetApiToHostEvent
} from "@matrix-widget-toolkit/api";

export function useWidgetApi() {
  const [api, setApi] = useState<WidgetApi | null>(null);

  useEffect(() => {
    const widgetApi = createWidgetApi();
    widgetApi.start();
    widgetApi.requestCapability(WidgetApiToHostEvent.SendEvent);
    widgetApi.requestCapability(WidgetApiToHostEvent.ReceiveEvent);
    setApi(widgetApi);

    return () => widgetApi.stop();
  }, []);

  return api;
}
