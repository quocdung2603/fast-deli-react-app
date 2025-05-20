export const RenderName30Words= (data:string)=>{
    return data.length > 30 ? data.slice(0,27)+"..." : data 
}