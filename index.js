require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Supabase client initialization
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Handlebars setup
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Routes
app.get('/', async (req, res) => {
    try {
        const { data: todos, error } = await supabase
            .from('todos')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.render('home', { todos });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Error fetching todos' });
    }
});

app.post('/todos', async (req, res) => {
    try {
        const { title } = req.body;
        const { error } = await supabase
            .from('todos')
            .insert([{ title, completed: false }]);

        if (error) throw error;
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Error creating todo' });
    }
});

app.post('/todos/:id/toggle', async (req, res) => {
    try {
        const { id } = req.params;
        const { completed } = req.body;
        
        const { error } = await supabase
            .from('todos')
            .update({ completed })
            .eq('id', id);

        if (error) throw error;
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Error updating todo' });
    }
});

app.post('/todos/:id/delete', async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('todos')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Error deleting todo' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
