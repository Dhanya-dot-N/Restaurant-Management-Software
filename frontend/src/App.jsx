import { useState, useEffect } from 'react'
import POS from './pages/POS'
import KDS from './pages/KDS'
import Inventory from './pages/Inventory'
import MenuManager from './pages/MenuManager'
import Billing from './pages/Billing'
import Dashboard from './pages/Dashboard'
import { updateOrderStatus } from './api'
import './App.css'

export default function App() {
  const [page, setPage] = useState('pos')
  const [time, setTime] = useState('')
  const [newOrder, setNewOrder] = useState(null)
  const [paymentCtx, setPaymentCtx] = useState(null)
  const [menuVersion, setMenuVersion] = useState(0)
  const [billingVersion, setBillingVersion] = useState(0)
  const [paySuccess, setPaySuccess] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState(null)

  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }, 1000)
    return () => clearInterval(t)
  }, [])

  function handleOrderSent(order) {
    setNewOrder(order)
    setPage('kds')
  }

  function handleGoToPayment(ctx) {
    setPaymentCtx(ctx)
    setPaySuccess(false)
    setSelectedMethod(null)
    setPage('payment')
  }

  const navItems = [
    { id: 'pos', label: 'POS' },
    { id: 'kds', label: 'Kitchen' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'menu-mgr', label: 'Menu Manager' },
    { id: 'billing', label: 'Billing' },
    { id: 'dashboard', label: 'Dashboard' },
  ]

  return (
    <>
      <nav className="nav">
        <span className="nav-logo">BITES</span>
        {navItems.map(n => (
          <button key={n.id} className={`nav-btn ${page===n.id?'active':''}`} onClick={() => setPage(n.id)}>
            {n.label}
          </button>
        ))}
        <span className="nav-time">{time}</span>
      </nav>

      {page === 'pos' && <POS onOrderSent={handleOrderSent} key={menuVersion}/>}
      {page === 'kds' && <KDS newOrder={newOrder}/>}
      {page === 'inventory' && <Inventory/>}
      {page === 'menu-mgr' && <MenuManager onMenuUpdate={()=>setMenuVersion(v=>v+1)}/>}
      {page === 'billing' && <Billing onGoToPayment={handleGoToPayment} key={billingVersion}/>}
      {page === 'dashboard' && <Dashboard/>}

      {/* Payment page */}
      {page === 'payment' && paymentCtx && (
        <div className="page" style={{maxWidth:'460px',margin:'0 auto'}}>
          <div style={{background:'var(--surface)',borderRadius:'14px',padding:'26px',border:'1px solid var(--border)'}}>
            {paySuccess ? (
              <div style={{textAlign:'center',padding:'20px 0'}}>
                <div style={{fontSize:'52px',marginBottom:'12px'}}>✅</div>
                <h2 style={{fontFamily:'var(--font-head)',fontSize:'22px',fontWeight:'800',color:'var(--teal)',marginBottom:'8px'}}>Payment Successful!</h2>
                <p style={{marginBottom:'6px'}}>#{paymentCtx.order.id} · {paymentCtx.order.table_name}</p>
                <p style={{color:'var(--teal)',fontSize:'16px',fontFamily:'var(--font-head)',fontWeight:'700',marginBottom:'6px'}}>₹{paymentCtx.total} via {selectedMethod}</p>
                <p style={{color:'var(--muted)',fontSize:'13px',marginBottom:'20px'}}>
                  {paymentCtx.st.tip ? `Includes ${paymentCtx.st.tip}% tip · ` : ''}
                  {paymentCtx.st.split ? `Split ${paymentCtx.st.splitN} ways` : ''}
                </p>
                <button className="btn btn-teal" style={{padding:'12px 32px'}}
                  onClick={() => { setPage('billing') }}>
                  ← Back to Billing
                </button>
              </div>
            ) : (
              <>
                <div style={{fontFamily:'var(--font-head)',fontSize:'20px',fontWeight:'800',marginBottom:'4px'}}>Payment</div>
                <div style={{fontSize:'13px',color:'var(--muted)',marginBottom:'22px'}}>
                  #{paymentCtx.order.id} · {paymentCtx.order.table_name}
                  {paymentCtx.st.tip ? ` · ${paymentCtx.st.tip}% tip` : ''}
                </div>
                <div style={{textAlign:'center',marginBottom:'24px'}}>
                  <div style={{fontFamily:'var(--font-head)',fontSize:'44px',fontWeight:'800',color:'var(--teal)'}}>
                    ₹{paymentCtx.perPerson || paymentCtx.total}
                  </div>
                  <div style={{fontSize:'12px',color:'var(--muted)'}}>
                    {paymentCtx.perPerson ? `per person (${paymentCtx.st.splitN} people) · Total ₹${paymentCtx.total}` : 'Total amount'}
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'20px'}}>
                  {[['📱','UPI'],['💳','Card'],['💵','Cash'],['👛','Wallet']].map(([emoji,method])=>(
                    <div key={method} onClick={()=>setSelectedMethod(method)}
                      style={{padding:'14px',borderRadius:'10px',textAlign:'center',cursor:'pointer',
                        border:`1px solid ${selectedMethod===method?'var(--teal)':'var(--border)'}`,
                        background:selectedMethod===method?'#00d4a015':'var(--surface2)',
                        color:selectedMethod===method?'var(--teal)':'var(--muted)',
                        fontFamily:'var(--font-head)',fontSize:'12px',fontWeight:'600',transition:'all .15s'}}>
                      <div style={{fontSize:'22px',marginBottom:'4px'}}>{emoji}</div>{method}
                    </div>
                  ))}
                </div>
                <button className="btn btn-teal" style={{width:'100%',padding:'14px',fontSize:'14px'}}
                  onClick={async ()=>{
                    if(!selectedMethod){alert('Select a payment method');return;}
                    await updateOrderStatus(paymentCtx.order.id, 'paid')
                    setPaySuccess(true)
                    setBillingVersion(v => v+1)
                  }}>
                  Confirm Payment
                </button>
                <div onClick={()=>setPage('billing')}
                  style={{textAlign:'center',marginTop:'14px',fontSize:'12px',color:'var(--muted)',cursor:'pointer',textDecoration:'underline'}}>
                  ← Back to Billing
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}