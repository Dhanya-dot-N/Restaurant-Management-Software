import { useState, useEffect } from 'react'
import { getMenu, createOrder } from '../api'

export default function POS({ onOrderSent }) {
  const [menu, setMenu] = useState([])
  const [cart, setCart] = useState([])
  const [cat, setCat] = useState('all')
  const [table, setTable] = useState('Table 1')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMenu().then(data => { setMenu(data); setLoading(false) })
  }, [])

  const cats = ['all', ...new Set(menu.map(i => i.category))]

  const filtered = cat === 'all' ? menu : menu.filter(i => i.category === cat)

  function addToCart(item) {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...item, qty: 1, note: '' }]
    })
  }

  function changeQty(id, delta) {
    setCart(prev => prev
      .map(i => i.id === id ? { ...i, qty: i.qty + delta } : i)
      .filter(i => i.qty > 0)
    )
  }

  function updateNote(id, note) {
    setCart(prev => prev.map(i => i.id === id ? { ...i, note } : i))
  }

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0)

  async function sendOrder() {
    if (!cart.length) return
    const order = await createOrder(table, cart.map(i => ({
      name: i.name, price: i.price, qty: i.qty, note: i.note
    })))
    onOrderSent(order)
    setCart([])
  }

  if (loading) return <div className="page" style={{color:'var(--muted)'}}>Loading menu...</div>

  return (
    <div className="page" style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:'14px',height:'calc(100vh - 72px)'}}>

      {/* Menu panel */}
      <div style={{background:'var(--surface)',borderRadius:'12px',padding:'14px',overflowY:'auto'}}>
        <div className="section-title">Menu</div>
        <div style={{display:'flex',gap:'6px',flexWrap:'wrap',marginBottom:'14px'}}>
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)}
              style={{padding:'4px 12px',borderRadius:'20px',border:'1px solid',
                borderColor: c===cat ? 'var(--teal)' : 'var(--border)',
                background: c===cat ? 'var(--teal)' : 'none',
                color: c===cat ? 'var(--bg)' : 'var(--muted)',
                fontFamily:'var(--font-body)',fontSize:'12px',cursor:'pointer'}}>
              {c.charAt(0).toUpperCase()+c.slice(1)}
            </button>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))',gap:'9px'}}>
          {filtered.map(item => (
            <div key={item.id} onClick={() => addToCart(item)}
              style={{background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:'10px',
                padding:'12px 10px',cursor:'pointer',transition:'all .15s'}}
              onMouseOver={e=>e.currentTarget.style.borderColor='var(--teal)'}
              onMouseOut={e=>e.currentTarget.style.borderColor='var(--border)'}>
              <div style={{fontSize:'22px',marginBottom:'6px'}}>{item.emoji}</div>
              <div style={{fontFamily:'var(--font-head)',fontSize:'12px',fontWeight:'600',marginBottom:'3px'}}>{item.name}</div>
              <div style={{fontSize:'12px',color:'var(--teal)'}}>₹{item.price}</div>
              <div style={{fontSize:'10px',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.5px'}}>{item.category}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Order panel */}
      <div style={{background:'var(--surface)',borderRadius:'12px',padding:'14px',display:'flex',flexDirection:'column',gap:'10px'}}>
        <div className="section-title">Current Order</div>
        <select value={table} onChange={e=>setTable(e.target.value)} style={{width:'100%'}}>
          {['Table 1','Table 2','Table 3','Table 4','Table 5','Takeaway'].map(t=>(
            <option key={t}>{t}</option>
          ))}
        </select>

        <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:'6px',maxHeight:'320px'}}>
          {cart.length === 0
            ? <div style={{textAlign:'center',padding:'30px',color:'var(--muted)',fontSize:'12px'}}>No items yet.<br/>Tap menu items to add.</div>
            : cart.map(item => (
              <div key={item.id} style={{background:'var(--surface2)',borderRadius:'8px',padding:'8px 10px'}}>
                <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'4px'}}>
                  <span style={{fontSize:'12px',flex:1}}>{item.emoji} {item.name}</span>
                  <div style={{display:'flex',alignItems:'center',gap:'4px'}}>
                    <button onClick={()=>changeQty(item.id,-1)}
                      style={{width:'20px',height:'20px',borderRadius:'50%',border:'1px solid var(--border)',
                        background:'none',color:'var(--text)',cursor:'pointer',fontSize:'13px'}}>−</button>
                    <span style={{fontSize:'12px',minWidth:'14px',textAlign:'center'}}>{item.qty}</span>
                    <button onClick={()=>changeQty(item.id,1)}
                      style={{width:'20px',height:'20px',borderRadius:'50%',border:'1px solid var(--border)',
                        background:'none',color:'var(--text)',cursor:'pointer',fontSize:'13px'}}>+</button>
                  </div>
                  <span style={{fontSize:'12px',color:'var(--amber)',minWidth:'48px',textAlign:'right'}}>₹{item.price*item.qty}</span>
                </div>
                <textarea value={item.note} onChange={e=>updateNote(item.id,e.target.value)}
                  placeholder="Chef notes: spice level, oil, salt…"
                  style={{width:'100%',fontSize:'11px',padding:'5px 8px',borderRadius:'6px',
                    height:'30px',resize:'none',background:'var(--bg)',border:'1px solid var(--border)',
                    color:'var(--text)',fontFamily:'var(--font-body)'}}/>
              </div>
            ))
          }
        </div>

        <div className="divider"/>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{fontFamily:'var(--font-head)',fontSize:'12px',color:'var(--muted)'}}>Total</span>
          <span style={{fontFamily:'var(--font-head)',fontSize:'22px',fontWeight:'800',color:'var(--teal)'}}>₹{total}</span>
        </div>
        <button onClick={sendOrder} disabled={cart.length===0} className="btn btn-teal"
          style={{width:'100%',padding:'12px',fontSize:'13px',opacity:cart.length?1:.4}}>
          Send to Kitchen
        </button>
      </div>
    </div>
  )
}