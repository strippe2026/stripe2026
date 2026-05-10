require('dotenv').config()
const express = require('express')
// N'oublie pas de cacher ta vraie clé dans le fichier .env !
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const app = express()

app.set('view engine','ejs')
app.use(express.urlencoded({ extended: true }))

app.get('/',(req,res) => {
    res.render('index') 
})

app.post('/checkout', async (req, res) => {
    const quantity = parseInt(req.body.quantity) || 1
    
    if (quantity < 1 || quantity > 99) {
        return res.redirect('/')
    }
    
    const session = await stripe.checkout.sessions.create({
        line_items:[
            {                    
                price_data: {
                    currency:'eur',
                    product_data:{
                        name:'Node.js and Express book'
                    },
                    unit_amount: 300 * 100  // 300€ en centimes
                },
                quantity: quantity 
            }
        ],
        mode: 'payment',
        success_url: `${process.env.BASE_URL}/complete?session_id={CHECKOUT_SESSION_ID}`, 
        cancel_url: `${process.env.BASE_URL}/cancel`,
    })

    res.redirect(session.url)
})

app.get('/complete', (req,res)=>{
    res.send('Paiement réussi ! Merci pour votre achat 🎉')
})

app.get('/cancel', (req,res)=>{
    res.redirect('/')
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));