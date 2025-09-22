export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    
    // Sua lógica de autenticação aqui
    const user = await authenticateUser(email, password);
    
    res.status(200).json({ 
      success: true, 
      user: user,
      token: generateToken(user.id)
    });
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Credenciais inválidas' 
    });
  }
}