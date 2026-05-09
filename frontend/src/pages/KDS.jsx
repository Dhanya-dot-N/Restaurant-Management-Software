import { useState, useEffect } from 'react'
import { getOrders, updateOrderStatus } from '../api'

export default function KDS({ newOrder }) {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    getOrders().then(setOrders)
  }, [])

  useEffect(() => {
    if (newOrder) setOrders(prev => [newOrder, ...prev])
  }, [newOrder])

  async function advance(order) {
    const next = order.status === 'pending' ? 'prep' : 'done'
    await updateOrderStatus(order.id, next)
    setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: next } : o))
  }

  const pending = orders.filter(o => o.status === 'pending').length
  const prep = orders.filter(o => o.status === 'prep').length
  const done = orders.filter(o => o.status === 'done').length

  return (
    <div className="page">
      <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'14px',flexWrap:'wrap'}}>
        <span className="section-title" style={{margin:0}}>Live Orders</span>
        <span style={{padding:'4px 12px',borderRadius:'20px',fontSize:'11px',fontFamily:'var(--font-head)',fontWeight:'700',background:'#ff5c5c22',color:'var(--coral)',border:'1px solid #ff5c5c44'}}>{pending} Pending</span>
        <span style={{padding:'4px 12px',borderRadius:'20px',fontSize:'11px',fontFamily:'var(--font-head)',fontWeight:'700',background:'#ffb33022',color:'var(--amber)',border:'1px solid #ffb33044'}}>{prep} Preparing</span>
        <span style={{padding:'4px 12px',borderRadius:'20px',fontSize:'11px',fontFamily:'var(--font-head)',fontWeight:'700',background:'#00d4a022',color:'var(--teal)',border:'1px solid #00d4a044'}}>{done} Done</span>
      </div>

      <div className="ai-banner">
        <div className="ai-dot"/>
        <div className="ai-text">AI tip: <strong>Peak hour detected.</strong> Butter Chicken and Garlic Naan ordered together 78% of the time — prep in batches.</div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))',gap:'12px'}}>
        {orders.map(order => (
          <div key={order.id} style={{
            background:'var(--surface)',borderRadius:'12px',padding:'14px',
            borderLeft:`4px solid ${order.status==='done'?'var(--teal)':order.status==='prep'?'var(--amber)':'var(--coral)'}`,
            opacity: order.status==='done' ? .6 : 1}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'10px'}}>
              <div>
                <div style={{fontFamily:'var(--font-head)',fontSize:'15px',fontWeight:'800'}}>#{order.id}</div>
                <div style={{fontSize:'10px',color:'var(--muted)',marginTop:'2px'}}>{order.table_name}</div>
              </div>
              <div style={{fontSize:'10px',color:order.status==='done'?'var(--teal)':order.status==='prep'?'var(--amber)':'var(--coral)'}}>
                {order.status==='done'?'Completed':order.status==='prep'?'Preparing':'Pending'}
              </div>
            </div>

            <div style={{display:'flex',flexDirection:'column',gap:'5px',marginBottom:'12px'}}>
              {(order.items||[]).map((item,i) => (
                <div key={i}>
                  <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
                    <span style={{fontFamily:'var(--font-head)',fontSize:'11px',fontWeight:'700',color:'var(--teal)',minWidth:'18px'}}>×{item.quantity}</span>
                    <span style={{fontSize:'12px',textDecoration:order.status==='done'?'line-through':'none',color:order.status==='done'?'var(--muted)':'var(--text)'}}>{item.item_name}</span>
                  </div>
                  {item.notes && <div style={{fontSize:'10px',color:'var(--purple)',paddingLeft:'24px',fontStyle:'italic'}}>📝 {item.notes}</div>}
                </div>
              ))}
            </div>

            {order.status !== 'done' && (
              <button onClick={() => advance(order)}
                className="btn"
                style={{width:'100%',padding:'7px',
                  background: order.status==='pending'?'#ffb33022':'#00d4a022',
                  color: order.status==='pending'?'var(--amber)':'var(--teal)',
                  border:`1px solid ${order.status==='pending'?'#ffb33044':'#00d4a044'}`}}>
                {order.status==='pending' ? 'Start Preparing' : 'Mark Done'}
              </button>
            )}
            {order.status === 'done' && (
              <button disabled className="btn" style={{width:'100%',padding:'7px',background:'#ffffff11',color:'var(--muted)'}}>Completed</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}