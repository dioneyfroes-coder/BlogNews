// src/models/Category.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface para o documento Category
export interface ICategory extends Document {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon: string;
  isDefault: boolean;
  isActive: boolean;
  order: number;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
  incrementPostCount(): Promise<ICategory>;
  decrementPostCount(): Promise<ICategory>;
}

// Interface para métodos estáticos do modelo
export interface ICategoryModel extends Model<ICategory> {
  ensureDefaultCategory(): Promise<ICategory>;
  getActiveCategories(): Promise<ICategory[]>;
}

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 50
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: 200,
    default: ''
  },
  color: {
    type: String,
    default: '#1976d2',
    match: /^#[0-9A-Fa-f]{6}$/
  },
  icon: {
    type: String,
    default: 'Category'
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  postCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Índices adicionais para performance
categorySchema.index({ isActive: 1 });
categorySchema.index({ order: 1 });

// Middleware para gerar slug automaticamente
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplicados
      .replace(/^-+|-+$/g, ''); // Remove hífens do início/fim
  }
  next();
});

// Método estático para garantir categoria padrão
categorySchema.statics.ensureDefaultCategory = async function() {
  const defaultCategory = await this.findOne({ isDefault: true });
  
  if (!defaultCategory) {
    return await this.create({
      name: 'Sem categoria',
      description: 'Categoria padrão para posts sem categoria específica',
      color: '#757575',
      icon: 'Help',
      isDefault: true,
      order: 999
    });
  }
  
  return defaultCategory;
};

// Método estático para obter categorias ativas
categorySchema.statics.getActiveCategories = async function() {
  return await this.find({ isActive: true })
    .sort({ order: 1, name: 1 })
    .select('name slug description color icon postCount');
};

// Método para incrementar contador de posts
categorySchema.methods.incrementPostCount = async function() {
  this.postCount += 1;
  return await this.save();
};

// Método para decrementar contador de posts
categorySchema.methods.decrementPostCount = async function() {
  if (this.postCount > 0) {
    this.postCount -= 1;
    return await this.save();
  }
  return this;
};

const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);

export default Category;
