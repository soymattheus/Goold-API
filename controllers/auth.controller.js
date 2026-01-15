const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { AuthData } = require("../data/auth.data");
const { TokenBlacklist } = require("../models");

exports.AuthController = {
  login: async (req, res) => {
    const { email, password } = req.body;

    const response = await AuthData.getUser(email);
    const user = response[0];

    if (email !== user.email) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({ message: "Senha inválida" });
    }

    const token = jwt.sign(
      {
        idUser: user.id_user,
        emailUser: user.email,
        typeUser: user.type_user,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    let userData = {
      name: user.name,
      lastName: user.last_name,
      email: user.email,
      userType: user.type_user,
    };

    if (user.type_user === "customer") {
      userData = {
        ...userData,
        state: user.state,
        zipCode: user.zip_code,
        street: user.street,
        houseNumber: user.house_number,
        complement: user.complement,
        neighborhood: user.neighborhood,
        city: user.city,
      };
    }

    return res.json({ token: token, userData });
  },

  register: async (req, res) => {
    const data = req.body;

    const userExists = await AuthData.getUser(data.email);
    if (userExists[0]) {
      return res
        .status(400)
        .json({ message: "Já existe usuário cadasrado com esse e-mail" });
    }

    if (
      !(
        data.name &&
        data.lastName &&
        data.email &&
        data.password &&
        data.zipCode
      )
    ) {
      return res
        .status(400)
        .json({ message: "Preencha os campos obrigatórios" });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const result = await AuthData.createUser({ ...data, passwordHash });

    return res.status(201).json({ status: "Ok" });
  },

  logout: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(400).json({ message: "Token não informado" });
      }

      const [, token] = authHeader.split(" ");

      const decoded = jwt.decode(token);

      if (!decoded?.exp) {
        return res.status(400).json({ message: "Token inválido" });
      }

      await TokenBlacklist.create({
        token,
        expires_at: new Date(decoded.exp * 1000),
      });

      return res.json({ message: "Logout realizado com sucesso" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao fazer logout" });
    }
  },
};
