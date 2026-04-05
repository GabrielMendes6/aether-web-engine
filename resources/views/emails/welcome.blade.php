<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 20px; }
        .card { background: white; max-width: 600px; margin: 0 auto; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
        .button { background-color: #000; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
        .footer { font-size: 12px; color: #888; margin-top: 30px; text-align: center; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h2>Bem-vindo à Box Presentes, {{ $newUser->name }}!</h2>
        </div>
        <p>Olá, ficamos felizes em ter você conosco. Sua conta foi criada com sucesso usando os mais altos padrões de segurança.</p>
        <p>Agora você já pode explorar nossas boxes personalizadas e montar o presente perfeito.</p>
        
        <a href="{{ config('app.url') }}" class="button">Acessar minha conta</a>

        <div class="footer">
            Este é um e-mail automático. Por favor, não responda. <br>
            Brusque, Santa Catarina.
        </div>
    </div>
</body>
</html>