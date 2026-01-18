const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { TokenBlacklist, User } = require("../models");
const { v4: uuidv4 } = require("uuid");

exports.AuthController = {
  login: async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({ message: "Senha inválida" });
    }

    if (user.status !== "1") {
      return res.status(401).json({ message: "Usuário inativo" });
    }

    const token = jwt.sign(
      {
        idUser: user.id_user,
        emailUser: user.email,
        typeUser: user.type_user,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    const userData = user.toJSON();
    delete userData.password;

    if (user.type_user === "admin") {
      delete userData.state;
      delete userData.zip_code;
      delete userData.street;
      delete userData.house_number;
      delete userData.complement;
      delete userData.neighborhood;
      delete userData.city;
    }

    return res.json({ token: token, user: userData });
  },

  register: async (req, res) => {
    try {
      const {
        name,
        last_name,
        email,
        password,
        type_user,
        zip_code,
        street,
        house_number,
        complement,
        neighborhood,
        city,
        state,
      } = req.body;

      const userExists = await User.findOne({
        where: { email },
      });

      if (userExists) {
        return res
          .status(400)
          .json({ message: "Já existe usuário cadastrado com esse e-mail" });
      }

      if (!(name && last_name && email && password && zip_code)) {
        return res
          .status(400)
          .json({ message: "Preencha os campos obrigatórios" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({
        id_user: uuidv4(),
        name,
        last_name,
        email,
        password: passwordHash,
        type_user: type_user || "customer",
        zip_code,
        street,
        house_number: house_number || undefined,
        complement,
        neighborhood,
        city,
        state,
        permission_appointments: "0",
        permission_logs: "0",
        status: "0",
        created_at: new Date(),
        decrypted_password: password,
      });

      return res.status(201).json(user);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "Ocorreu um erro durante a criação do usuário." });
    }
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
