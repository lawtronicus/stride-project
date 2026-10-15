'use client';
import { Flag, ArrowUpRight } from 'lucide-react';
import { addDays } from '../../lib/model.mjs';

// The runner follows calendar position in the saved plan, not workout compliance.
export default function TrainingJourney({data,today,current,onWeek}:{data:any,today:string,current:number,onWeek:(n:number)=>void}){
 const start=data.weeks[0].start;
 const scheduledRace=data.workouts.find((w:any)=>w.kind==='run'&&w.plan.type==='Race')?.plan.date;
 const end=scheduledRace&&scheduledRace>data.weeks[25].start?scheduledRace:addDays(data.weeks[25].start,6);
 const position=(date:string)=>Math.max(0,Math.min(100,(Date.parse(date)-Date.parse(start))/(Date.parse(end)-Date.parse(start))*100));
 const progress=position(today),finished=today>=end;
 const phases=[{week:0,label:'Recovery',short:'Recovery',range:'Before the block',tone:'recovery'}, {week:1,label:'Build the base',short:'Base',range:'Weeks 1–8',tone:'base'}, {week:9,label:'Endurance & hills',short:'Endurance',range:'Weeks 9–15',tone:'endurance'}, {week:16,label:'Marathon specific',short:'Race prep',range:'Weeks 16–22',tone:'specific'}, {week:23,label:'Taper & race',short:'Taper',range:'Weeks 23–25',tone:'taper'}];
 const currentPhase=phases.filter(p=>p.week<=current).at(-1)!;
 const label=finished?'At the finish line':current===0?'Recovery week':`Week ${current} of 25`;
 const date=(d:string)=>new Date(d+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric'});
 return <section className="panel training-journey" aria-label="Your position in the training plan">
  <div className="section-heading"><div><div className="eyebrow">ONE STEP CLOSER</div><h2>Your road to the finish line</h2></div><button className="text-button" onClick={()=>onWeek(current)}>{label} <ArrowUpRight size={15}/></button></div>
  <div className="journey-status"><span><i className="live-dot"/>{finished?'Training timeline reached':currentPhase.label}</span><span>Calendar progress · {Math.round(progress)}% elapsed</span></div>
  <div className="journey-course">
   <div className="journey-runner" style={{left:`${progress}%`}} aria-hidden="true">
    <span className={'runner-callout '+(progress<15?'near-start':progress>85?'near-finish':'')}>{finished?'Finish line':'You are here'}</span>
    <img src="/runner.png" className="runner-figure runner-illustration" alt="" width={96} height={96} draggable={false}/>
   </div>
   <div className="journey-track" role="progressbar" aria-label="Elapsed training timeline" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} aria-valuetext={`${label}. ${Math.round(progress)} percent of the training timeline elapsed.`}>
    {phases.map((p,i)=>{const left=position(data.weeks[p.week].start),right=i===phases.length-1?100:position(data.weeks[phases[i+1].week].start);return <span key={p.week} className={'journey-segment '+p.tone} style={{left:`${left}%`,width:`${right-left}%`}}/>})}
    <span className="journey-travelled" style={{width:`${progress}%`}}/>
    {phases.slice(1).map(p=><span key={p.week} className="journey-tick" style={{left:`${position(data.weeks[p.week].start)}%`}}/>)}
   </div>
   <span className="journey-start-dot" aria-hidden="true"/>
   <span className="journey-finish" aria-hidden="true"><Flag size={17}/></span>
   <div className="journey-endpoints"><span>RECOVERY START<small>{date(start)}</small></span><span>RACE ON THE PLAN<small>{date(end)}</small></span></div>
  </div>
  <div className="journey-phases">{phases.map(p=><button key={p.week} className={p.week===currentPhase.week?'is-current':''} onClick={()=>onWeek(p.week)} aria-label={`Open ${p.label}, ${p.week===0?'recovery week':'week '+p.week}`}><span className={'phase-dot '+p.tone}/><span><strong><span className="phase-full">{p.label}</span><span className="phase-short">{p.short}</span></strong><small>{p.range}</small></span>{p.week===currentPhase.week&&<span className="phase-now">NOW</span>}</button>)}</div>
  <p className="journey-explainer">The runner moves with the date in Seoul. Your completed training is tracked in the totals below.</p>
  {data.settings.raceDate!==end&&<p className="fine">Race date setting: {date(data.settings.raceDate)}. This timeline follows your saved workout schedule; review the race session and taper if the date changes.</p>}
 </section>
}
