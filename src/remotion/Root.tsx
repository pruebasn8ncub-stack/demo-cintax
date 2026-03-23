import { Composition } from "remotion";
import { HeroSequence } from "./HeroSequence";
import { FlowAnimation } from "./FlowAnimation";
import { ToolShowcase } from "./ToolShowcase";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HeroSequence"
        component={HeroSequence}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FlowAnimation"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={FlowAnimation as any}
        durationInFrames={90}
        fps={30}
        width={800}
        height={200}
        defaultProps={{ workflowIndex: 0 }}
      />
      <Composition
        id="ToolShowcase"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={ToolShowcase as any}
        durationInFrames={60}
        fps={30}
        width={400}
        height={200}
        defaultProps={{ toolIndex: 0 }}
      />
    </>
  );
};
