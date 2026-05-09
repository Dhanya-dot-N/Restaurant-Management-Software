import { useState, useEffect } from 'react'
import { getMenu, addMenuItem, updateMenuPrice } from '../api'

export default function MenuManager({ onMenuUpdate }) {
  const [menu, setMenu] = useState([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('starters')
  const [emoji, setEmoji] = useState('')
  const [editItem, setEditItem] = useState(null)
  const [newPrice, setNewPrice] = useState('')

  useEffect(() => { getMenu().then(setMenu) }, [])

  async function handleAdd() {
    if (!name || !price) return alert('Fill in name and price')
    const item = await addMenuItem({ name, price: parseInt(price), category, emoji: emoji || '🍽️' })
    setMenu(prev => [...prev, item])
    onMenuUpdate()
    setName(''); setPrice(''); setEmoji('')
  }

  async function handlePriceUpdate() {
    if (!newPrice) return alert('Enter a valid price')
    const updated = await updateMenuPrice(editItem.id, parseInt(newPrice))
    setMenu(prev => prev.map(i => i.id === updated.id ? updated : i))
    onMenuUpdate()
    setEditItem(null); setNewPrice('')
  }

  return (
    <div className="page">
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>

        {/* Add new item */}
        <div style={{background:'var(--surface)',borderRadius:'12px',padding:'18px'}}>
          <div className="section-title">Add New Item</div>
          <div className="field"><label>Item Name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Paneer Biryani" style={{width:'100%'}}/></div>
          <div className="field"><label>Price (₹)</label><input type="number" value={price} onChange={e=>setPrice(e.target.value)} placeholder="0" style={{width:'100%'}}/></div>
          <div className="field"><label>Category</label>
            <select value={category} onChange={e=>setCategory(e.target.value)} style={{width:'100%'}}>
              <option value="starters">Starters</option>
              <option value="mains">Mains</option>
              <option value="drinks">Drinks</option>
              <option value="desserts">Desserts</option>
            </select>
          </div>
          <div className="field"><label>Emoji</label><input value={emoji} onChange={e=>setEmoji(e.target.value)} placeholder="🍽️" maxLength={2} style={{width:'100%'}}/></div>
          <button className="btn btn-teal" style={{width:'100%'}} onClick={handleAdd}>Add to Menu</button>
        </div>

        {/* Edit existing */}
        <div style={{background:'var(--surface)',borderRadius:'12px',padding:'18px'}}>
          <div className="section-title">All Items — click to edit price</div>
          <div style={{display:'flex',flexDirection:'column',gap:'8px',maxHeight:'calc(100vh - 260px)',overflowY:'auto'}}>
            {menu.map(item => (
              <div key={item.id} style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 12px',background:'var(--surface2)',borderRadius:'9px',border:'1px solid var(--border)'}}>
                <span style={{fontSize:'20px'}}>{item.emoji}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:'13px',fontWeight:'500'}}>{item.name}</div>
                  <div style={{fontSize:'10px',color:'var(--muted)',fontFamily:'var(--font-head)',textTransform:'uppercase',letterSpacing:'.5px'}}>{item.category}</div>
                </div>
                <div style={{fontSize:'13px',color:'var(--teal)',fontWeight:'600',minWidth:'52px',textAlign:'right'}}>₹{item.price}</div>
                <button onClick={()=>{setEditItem(item);setNewPrice(item.price)}}
                  className="btn btn-ghost" style={{padding:'3px 10px',fontSize:'11px'}}>Edit</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit price modal */}
      {editItem && (
        <div className="modal-bg open">
          <div className="modal">
            <div className="modal-title">Edit Price: {editItem.name}</div>
            <div className="field"><label>New Price (₹)</label><input type="number" min="1" value={newPrice} onChange={e=>setNewPrice(e.target.value)} style={{width:'100%'}}/></div>
            <div className="modal-actions">
              <button className="btn btn-amber" style={{flex:1}} onClick={handlePriceUpdate}>Update Price</button>
              <button className="btn btn-ghost" onClick={()=>setEditItem(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}