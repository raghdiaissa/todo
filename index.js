require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Supabase client initialization
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        message: 'حدث خطأ في الخادم',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Handlebars setup
app.engine('handlebars', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', async (req, res, next) => {
    try {
        const { data: todos, error } = await supabase
            .from('todos')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }
        
        res.render('home', { todos: todos || [] });
    } catch (error) {
        next(error);
    }
});

app.post('/todos', async (req, res, next) => {
    try {
        const { title } = req.body;
        if (!title) {
            return res.status(400).render('error', { message: 'عنوان المهمة مطلوب' });
        }

        const { error } = await supabase
            .from('todos')
            .insert([{ title, completed: false }]);

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        res.redirect('/');
    } catch (error) {
        next(error);
    }
});

app.post('/todos/:id/toggle', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { completed } = req.body;
        
        const { error } = await supabase
            .from('todos')
            .update({ completed })
            .eq('id', id);

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        res.redirect('/');
    } catch (error) {
        next(error);
    }
});

app.post('/todos/:id/delete', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('todos')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        res.redirect('/');
    } catch (error) {
        next(error);
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Supabase URL configured:', !!process.env.SUPABASE_URL);
    console.log('Supabase Key configured:', !!process.env.SUPABASE_KEY);
});
