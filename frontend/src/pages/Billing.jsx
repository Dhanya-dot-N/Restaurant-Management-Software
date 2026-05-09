import { useState, useEffect } from 'react'
import { getOrders } from '../api'

export default function Billing({ onGoToPayment }) {
  const [orders, setOrders] = useState([])
  const [billState, setBillState] = useState({})

  useEffect(() => {
    getOrders().then(data => {
      const done = data.filter(o => o.status === 'done')
      setOrders(done)
      const state = {}
      done.forEach(o => { state[o.id] = { split: false, splitN: 2, tip: 0 } })
      setBillState(state)
    })
  }, [])

  function getSubtotal(order) {
    return (order.items || []).reduce((s, i) => s + i.item_price * i.quantity, 0)
  }

  function getTotal(order) {
    const st = billState[order.id] || { tip: 0 }
    return Math.round(getSubtotal(order) * (1 + st.tip / 100))
  }

  function update(orderId, key, val) {
    setBillState(prev => ({ ...prev, [orderId]: { ...prev[orderId], [key]: val } }))
  }

  if (!orders.length) return (
    <div className="page">
      <p style={{color:'var(--muted)',fontSize:'13px'}}>No completed orders yet. Mark orders as done in Kitchen Display.</p>
    </div>
  )

  return (
    <div className="page">
      <div className="section-title">Completed Orders — Ready to Bill</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'14px'}}>
        {orders.map(order => {
          const st = billState[order.id] || { split: false, splitN: 2, tip: 0 }
          const total = getTotal(order)
          const perPerson = st.split && st.splitN > 1 ? Math.ceil(total / st.splitN) : null
          return (
            <div key={order.id} style={{background:'var(--surface)',borderRadius:'12px',padding:'18px',border:'1px solid var(--border)'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'14px'}}>
                <div>
                  <div style={{fontFamily:'var(--font-head)',fontSize:'16px',fontWeight:'800'}}>#{order.id}</div>
                  <div style={{fontSize:'11px',color:'var(--muted)'}}>{order.table_name}</div>
                </div>
              </div>

              {/* Items */}
              <div style={{marginBottom:'12px'}}>
                {(order.items||[]).map((item,i) => (
                  <div key={i} style={{display:'flex',justifyContent:'space-between',fontSize:'12px',padding:'3px 0',borderBottom:'1px solid var(--border)'}}>
                    <span>{item.item_name} ×{item.quantity}</span>
                    <span>₹{item.item_price * item.quantity}</span>
                  </div>
                ))}
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'13px',fontWeight:'600',padding:'8px 0 4px',borderTop:'1px solid var(--border)',marginTop:'4px'}}>
                  <span>Subtotal</span><span>₹{getSubtotal(order)}</span>
                </div>
              </div>

              {/* Split toggle */}
              <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'10px',flexWrap:'wrap'}}>
                <span style={{fontSize:'11px',color:'var(--muted)',fontFamily:'var(--font-head)'}}>PAY</span>
                {['Together','Split'].map(opt => (
                  <button key={opt} onClick={() => update(order.id,'split', opt==='Split')}
                    style={{padding:'4px 12px',borderRadius:'20px',border:'1px solid var(--border)',
                      background: (opt==='Split'?st.split:!st.split) ? 'var(--amber)' : 'none',
                      borderColor: (opt==='Split'?st.split:!st.split) ? 'var(--amber)' : 'var(--border)',
                      color: (opt==='Split'?st.split:!st.split) ? 'var(--bg)' : 'var(--muted)',
                      fontSize:'12px',fontFamily:'var(--font-head)',cursor:'pointer'}}>
                    {opt}
                  </button>
                ))}
                {st.split && (
                  <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                    <span style={{fontSize:'11px',color:'var(--muted)'}}>÷</span>
                    <input type="number" min="2" max="10" value={st.splitN}
                      onChange={e=>update(order.id,'splitN',parseInt(e.target.value)||2)}
                      style={{width:'52px',padding:'4px 8px'}}/>
                    <span style={{fontSize:'11px',color:'var(--muted)'}}>people</span>
                  </div>
                )}
              </div>

              {/* Tip */}
              <div style={{display:'flex',gap:'5px',alignItems:'center',marginBottom:'12px',flexWrap:'wrap'}}>
                <span style={{fontSize:'11px',color:'var(--muted)',fontFamily:'var(--font-head)'}}>TIP</span>
                {[0,5,10,15].map(pct => (
                  <button key={pct} onClick={()=>update(order.id,'tip',pct)}
                    style={{padding:'4px 10px',borderRadius:'16px',border:'1px solid var(--border)',
                      background: st.tip===pct ? 'var(--teal)' : 'none',
                      borderColor: st.tip===pct ? 'var(--teal)' : 'var(--border)',
                      color: st.tip===pct ? 'var(--bg)' : 'var(--muted)',
                      fontSize:'12px',fontFamily:'var(--font-head)',cursor:'pointer'}}>
                    {pct===0?'No tip':`${pct}%`}
                  </button>
                ))}
              </div>

              {/* Total */}
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderTop:'1px solid var(--border)',marginBottom:'12px'}}>
                <div>
                  <div style={{fontSize:'11px',color:'var(--muted)',fontFamily:'var(--font-head)'}}>TOTAL</div>
                  {perPerson && <div style={{fontSize:'11px',color:'var(--amber)'}}>₹{perPerson} per person</div>}
                </div>
                <div style={{fontFamily:'var(--font-head)',fontSize:'20px',fontWeight:'800',color:'var(--teal)'}}>₹{total}</div>
              </div>

              <button className="btn btn-teal" style={{width:'100%'}}
                onClick={()=>onGoToPayment({order, total, perPerson, st})}>
                Ready to Pay →
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}