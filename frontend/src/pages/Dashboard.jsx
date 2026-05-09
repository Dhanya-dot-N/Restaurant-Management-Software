export default function Dashboard() {
  const hours = ['10','11','12','1','2','3','4','5','6','7','8','9']
  const vals = [420,890,1840,2100,1650,980,1200,2800,3400,2900,1800,980]
  const max = Math.max(...vals)
  const colors = ['#00d4a0','#00d4a0','#ffb330','#ffb330','#ffb330','#00d4a0','#00d4a0','#ff5c5c','#ff5c5c','#ff5c5c','#ffb330','#00d4a0']
  const dishes = [
    {n:'Butter Chicken',cnt:34,color:'#ff5c5c'},
    {n:'Biryani',cnt:28,color:'#ffb330'},
    {n:'Paneer Tikka',cnt:22,color:'#00d4a0'},
    {n:'Garlic Naan',cnt:48,color:'#a78bfa'},
    {n:'Mango Lassi',cnt:19,color:'#5eead4'},
  ]
  const maxD = Math.max(...dishes.map(d=>d.cnt))

  return (
    <div className="page">
      <div className="ai-banner">
        <div className="ai-dot"/>
        <div className="ai-text">AI insight: <strong>Saturday revenue up 18%</strong> vs last week. Dinner service drove most growth. Consider extending kitchen hours on weekends.</div>
      </div>

      {/* Stat cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px',marginBottom:'18px'}}>
        {[
          {label:'Today\'s Revenue',val:'₹18,420',sub:'↑ 12% vs yesterday',color:'var(--teal)'},
          {label:'Orders Today',val:'84',sub:'↑ 7 from yesterday',color:'var(--amber)'},
          {label:'Avg. Ticket Time',val:'14m',sub:'Target: 12m',color:'var(--coral)'},
          {label:'Tables Active',val:'6/12',sub:'50% occupancy',color:'var(--purple)'},
        ].map(card => (
          <div key={card.label} style={{background:'var(--surface)',borderRadius:'12px',padding:'16px',border:'1px solid var(--border)',borderTop:`3px solid ${card.color}`}}>
            <div style={{fontFamily:'var(--font-head)',fontSize:'10px',fontWeight:'700',letterSpacing:'1.5px',color:'var(--muted)',textTransform:'uppercase',marginBottom:'6px'}}>{card.label}</div>
            <div style={{fontFamily:'var(--font-head)',fontSize:'26px',fontWeight:'800'}}>{card.val}</div>
            <div style={{fontSize:'11px',color:'var(--muted)',marginTop:'3px'}}>{card.sub}</div>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
        {/* Bar chart */}
        <div style={{background:'var(--surface)',borderRadius:'12px',padding:'16px'}}>
          <div style={{fontFamily:'var(--font-head)',fontSize:'12px',fontWeight:'700',marginBottom:'14px'}}>Hourly Revenue</div>
          <div style={{display:'flex',alignItems:'flex-end',gap:'6px',height:'90px'}}>
            {hours.map((h,i) => (
              <div key={h} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'3px',flex:1}}>
                <div style={{width:'100%',borderRadius:'3px 3px 0 0',height:`${vals[i]/max*84}px`,background:colors[i],cursor:'pointer'}} title={`₹${vals[i]}`}/>
                <span style={{fontSize:'9px',color:'var(--muted)',fontFamily:'var(--font-head)'}}>{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top dishes */}
        <div style={{background:'var(--surface)',borderRadius:'12px',padding:'16px'}}>
          <div style={{fontFamily:'var(--font-head)',fontSize:'12px',fontWeight:'700',marginBottom:'14px'}}>Top Dishes Today</div>
          <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
            {dishes.map(d => (
              <div key={d.n} style={{display:'flex',alignItems:'center',gap:'8px'}}>
                <span style={{fontSize:'12px',flex:1}}>{d.n}</span>
                <div style={{flex:2,height:'5px',background:'var(--border)',borderRadius:'3px',overflow:'hidden'}}>
                  <div style={{height:'100%',borderRadius:'3px',background:d.color,width:`${d.cnt/maxD*100}%`}}/>
                </div>
                <span style={{fontSize:'11px',color:'var(--muted)',minWidth:'26px',textAlign:'right'}}>{d.cnt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}