import { useState, useEffect } from 'react'
import { getInventory, adjustInventory } from '../api'

export default function Inventory() {
  const [inventory, setInventory] = useState([])
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null) // {item, action}
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => { getInventory().then(setInventory) }, [])

  const filtered = inventory.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))

  async function applyAdj() {
    if (!amount || isNaN(amount)) return alert('Enter a valid amount')
    const updated = await adjustInventory(modal.item.id, parseFloat(amount), modal.action)
    setInventory(prev => prev.map(i => i.id === updated.id ? updated : i))
    setModal(null); setAmount(''); setNote('')
  }

  return (
    <div className="page">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'14px',flexWrap:'wrap',gap:'8px'}}>
        <span className="section-title" style={{margin:0}}>Stock Levels</span>
        <input placeholder="Search ingredient..." value={search} onChange={e=>setSearch(e.target.value)} style={{width:'180px'}}/>
      </div>

      <div className="ai-banner">
        <div className="ai-dot"/>
        <div className="ai-text">AI forecast: <strong>Tomatoes</strong> and <strong>Paneer</strong> will run out by tomorrow evening. Reorder now.</div>
      </div>

      <div style={{background:'var(--surface)',borderRadius:'12px',overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr style={{background:'var(--surface2)'}}>
              {['Ingredient','In Stock','Unit','Level','Status','Adjust'].map(h=>(
                <th key={h} style={{padding:'10px 14px',textAlign:'left',fontFamily:'var(--font-head)',fontSize:'10px',fontWeight:'700',letterSpacing:'1px',color:'var(--muted)',textTransform:'uppercase',borderBottom:'1px solid var(--border)'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => {
              const pct = Math.min(item.quantity / item.max_quantity * 100, 100)
              const status = pct > 50 ? 'ok' : pct > 20 ? 'warn' : 'crit'
              const label = pct > 50 ? 'OK' : pct > 20 ? 'Low' : 'Critical'
              const fillColor = pct > 50 ? 'var(--teal)' : pct > 20 ? 'var(--amber)' : 'var(--coral)'
              return (
                <tr key={item.id} style={{borderBottom:'1px solid var(--border)'}}>
                  <td style={{padding:'10px 14px',fontWeight:'500',fontSize:'13px'}}>{item.name}</td>
                  <td style={{padding:'10px 14px',fontSize:'13px'}}>{parseFloat(item.quantity).toFixed(1)}</td>
                  <td style={{padding:'10px 14px',fontSize:'13px',color:'var(--muted)'}}>{item.unit}</td>
                  <td style={{padding:'10px 14px'}}>
                    <div style={{height:'5px',borderRadius:'3px',background:'var(--border)',width:'70px',overflow:'hidden'}}>
                      <div style={{height:'100%',borderRadius:'3px',background:fillColor,width:`${pct}%`}}/>
                    </div>
                  </td>
                  <td style={{padding:'10px 14px'}}>
                    <span className={`badge badge-${status}`}>{label}</span>
                  </td>
                  <td style={{padding:'10px 14px'}}>
                    <div style={{display:'flex',gap:'5px'}}>
                      <button onClick={()=>setModal({item,action:'add'})} className="btn btn-ghost" style={{padding:'3px 9px',fontSize:'11px',borderColor:'#00d4a044',color:'var(--teal)'}}>+ Add</button>
                      <button onClick={()=>setModal({item,action:'use'})} className="btn btn-ghost" style={{padding:'3px 9px',fontSize:'11px',borderColor:'#ff5c5c44',color:'var(--coral)'}}>− Use</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Adjust Modal */}
      {modal && (
        <div className="modal-bg open">
          <div className="modal">
            <div className="modal-title">{modal.action==='add'?'Restock: ':'Kitchen Use: '}{modal.item.name}</div>
            <div className="field"><label>Amount ({modal.item.unit})</label><input type="number" min="0" step="0.1" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0"/></div>
            <div className="field"><label>Note (optional)</label><input value={note} onChange={e=>setNote(e.target.value)} placeholder="e.g. Morning restock"/></div>
            <div className="modal-actions">
              <button className="btn btn-teal" style={{flex:1}} onClick={applyAdj}>Apply</button>
              <button className="btn btn-ghost" onClick={()=>setModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}