import svgPaths from "./svg-2w568tdpuf";
import imgFrame from "figma:asset/4e95da5f9e6ec1d32f897fbff5c28b62b3c1d8ed.png";
import imgFrame1 from "figma:asset/516e77515feb8b0da14eb9d08100d04603ad8beb.png";
import imgUber0204586F83D0 from "figma:asset/9093dd69bfc675875c96f91b73a7450d5b957fca.png";

function Frame1410081207() {
  return (
    <div className="absolute bg-[#cf923d] box-border content-stretch flex gap-5 h-[94px] items-center justify-center left-[475px] px-[19.727px] py-[16.246px] rounded-[17px] top-[600px] w-[172px]">
      <div className="font-['Poppins:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[25.713px] text-nowrap">
        <p className="leading-[normal] whitespace-pre">Next</p>
      </div>
      <div className="h-0 relative shrink-0 w-[18px]">
        <div className="absolute inset-[-7.36px_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 16">
            <path d={svgPaths.p2826d400} fill="var(--stroke-0, white)" id="Vector 40" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame1410081546() {
  return (
    <div className="absolute h-[94px] left-[27px] top-[600px] w-[95px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 95 94">
        <g id="Frame 1410081546">
          <rect fill="var(--fill-0, black)" height="94" rx="17" width="95" />
          <path d={svgPaths.pa45cd00} fill="var(--stroke-0, white)" id="Vector 40" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return <div className="bg-[position:50%_50%,_53.92%_34.31%] bg-no-repeat bg-size-[cover,113.76%_121.18%] h-[170px] shrink-0 w-[182px]" data-name="Frame" style={{ backgroundImage: `url('${imgFrame}'), url('${imgFrame1}')` }} />;
}

function Frame1410081545() {
  return (
    <div className="absolute bg-[#ffffff] box-border content-stretch flex gap-2.5 items-center justify-start left-[27px] px-2.5 py-6 top-[107px] w-[592px]">
      <div className="font-['K2D:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#2a2a2a] text-[50px] w-[394px]">
        <p className="leading-[1.05]">{`Accept Rescue’s Terms & Review Privacy Note`}</p>
      </div>
      <Frame />
    </div>
  );
}

export default function Terms() {
  return (
    <div className="relative size-full" data-name="Terms">
      <div className="absolute bg-center bg-cover bg-no-repeat h-[1510px] left-0 top-0 w-[674px]" data-name="Uber 02-04_586f83d0" style={{ backgroundImage: `url('${imgUber0204586F83D0}')` }} />
      <Frame1410081207 />
      <Frame1410081546 />
      <Frame1410081545 />
    </div>
  );
}