function Frame1410081653() {
  return (
    <div className="[grid-area:1_/_1] bg-[#2e2c2a] box-border content-stretch flex gap-2.5 h-[119px] items-center justify-center ml-0 mt-0 pl-[279px] pr-[183px] py-[26px] relative rounded-[30px] w-[634px]">
      <div className="font-['Poppins:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[39.931px] text-nowrap text-white">
        <p className="leading-[normal] whitespace-pre">Start Earning</p>
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[0px_-2px_27.3px_0px_inset_#000000]" />
    </div>
  );
}

function Frame1410081654() {
  return (
    <div className="[grid-area:1_/_1] bg-white h-[118px] ml-0.5 mt-px relative rounded-[30px] w-[125px]">
      <div aria-hidden="true" className="absolute border-2 border-[#7f7f7f] border-solid inset-[-2px] pointer-events-none rounded-[32px]" />
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex gap-2.5 h-[118px] items-center justify-center pl-[276px] pr-[183px] py-[26px] relative w-[125px]">
          <div className="absolute font-['Samarkan:_Normal',_sans-serif] leading-[0] not-italic opacity-0 text-[#303030] text-[59.637px] text-nowrap top-[23px]" style={{ left: "calc(50% - 114.5px)" }}>
            <p className="leading-[normal] whitespace-pre">Namaste!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Button">
      <Frame1410081653 />
      <Frame1410081654 />
    </div>
  );
}

function Frame1410081655() {
  return (
    <div className="absolute bg-[#2a926a] box-border content-stretch flex gap-[11.835px] h-[126.633px] items-center justify-center left-14 p-[11.835px] rounded-[35.505px] top-9">
      <div aria-hidden="true" className="absolute border-[3px] border-solid border-white inset-0 pointer-events-none rounded-[35.505px] shadow-[0px_4px_14.1px_0px_rgba(0,0,0,0.25)]" />
      <div className="flex flex-col font-['SF_Pro:Medium',_sans-serif] font-[510] justify-center leading-[0] relative shrink-0 text-[#fdfdfd] text-[88.477px] text-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[167.278px] whitespace-pre">􀖬</p>
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[27px_3px_30.9px_0px_inset_rgba(255,255,255,0.26),-27px_3px_30.9px_0px_inset_rgba(0,0,0,0.25)]" />
    </div>
  );
}

export default function Frame1410081633() {
  return (
    <div className="bg-white relative shadow-[0px_7px_35.3px_0px_rgba(0,0,0,0.15)] size-full">
      <div className="flex flex-col items-end justify-center relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2.5 items-end justify-center pl-5 pr-[33px] py-[30px] relative size-full">
          <Button />
          <Frame1410081655 />
        </div>
      </div>
    </div>
  );
}