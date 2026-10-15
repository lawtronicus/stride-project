import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../../chatgpt-auth';
import { seed, validateState } from '../../../lib/model.mjs';
export const dynamic='force-dynamic';
const response=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(){
 const user=await getChatGPTUser();if(!user)return response({error:'Please sign in to load your training records.'},401);
 try{const db=env.DB!;await db.prepare('INSERT OR IGNORE INTO training_states (user_id,payload,version,updated_at) VALUES (?,?,1,?)').bind(user.userId,JSON.stringify(seed()),new Date().toISOString()).run();const row=await db.prepare('SELECT payload,version FROM training_states WHERE user_id=?').bind(user.userId).first<{payload:string,version:number}>();return response({state:JSON.parse(row!.payload),version:row!.version});}catch{return response({error:'Training records could not be loaded. Please retry.'},503);}
}
export async function PUT(request:Request){
 const user=await getChatGPTUser();if(!user)return response({error:'Please sign in before saving.'},401);
 if(request.headers.get('origin')&&request.headers.get('origin')!==new URL(request.url).origin)return response({error:'Invalid request origin.'},403);
 try{const raw=await request.text();if(raw.length>4000000)return response({error:'Backup is too large.'},413);const {state,version}=JSON.parse(raw);validateState(state);if(!Number.isInteger(version))throw Error('Invalid save version.');const result=await env.DB!.prepare('UPDATE training_states SET payload=?,version=version+1,updated_at=? WHERE user_id=? AND version=?').bind(JSON.stringify(state),new Date().toISOString(),user.userId,version).run();if(!result.meta.changes)return response({error:'Your records changed in another tab or device. Export your open data if needed, then reload before editing.'},409);return response({version:version+1});}catch(e){return response({error:e instanceof Error?e.message:'Unable to save. Please retry.'},400);}
}
