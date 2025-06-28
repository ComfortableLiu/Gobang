import path from 'path';
import type { Configuration } from '@rspack/core';
import { rspack } from '@rspack/core';
import ReactRefreshPlugin from '@rspack/plugin-react-refresh';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { fileURLToPath } from "node:url";
import SassEmbedded from 'sass-embedded'

// 由于在 ES 模块中没有 __dirname，所以我们需要创建它
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取当前环境
const isDev = process.env.NODE_ENV === 'development';

const config: Configuration = {
  // 入口文件配置
  entry: {
    main: './src/index.tsx'
  },

  // 输出配置
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isDev ? 'js/[name].js' : 'js/[name].[contenthash:8].js',
    assetModuleFilename: 'assets/[name].[hash:8][ext]',
    clean: true,
    publicPath: '/'
  },

  // 开发服务器配置
  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, 'public')
    },
    client: {
      overlay: {
        errors: true,
        warnings: false
      }
    }
  },

  experiments: {
    css: false,
  },

  // 模块规则
  module: {
    rules: [
      {
        test: /\.(tsx|ts|jsx)$/,
        use: {
          loader: 'builtin:swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: true
              },
              transform: {
                react: {
                  runtime: 'automatic',
                  development: isDev,
                  refresh: isDev
                }
              }
            }
          }
        },
        exclude: /node_modules/
      },

      // 图片资源规则
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: 'asset/resource'
      },

      // 字体资源规则
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: true,
                exportLocalsConvention: 'camelCase',
                localIdentName: '[name]__[local]--[hash:base64:5]'
              }
            }
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: true,
                exportLocalsConvention: 'camelCase',
                localIdentName: '[name]__[local]--[hash:base64:5]'
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              api: 'modern-compiler',
              implementation: SassEmbedded,
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 小于8kb的图片转为base64
          }
        },
        generator: {
          filename: 'static/images/[name].[hash:8][ext]'
        }
      },
    ]
  },

  // 解析配置
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },

  // 插件配置
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: './public/index.html',
      inject: 'body'
    }),
    // React 热更新插件 (仅开发环境)
    isDev ? new ReactRefreshPlugin() : false
  ].filter(Boolean) as Configuration['plugins'],

  // 优化配置
  optimization: {
    minimize: !isDev,
    minimizer: [new CssMinimizerPlugin()],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },

  // 开发工具配置
  devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map',

  // 模式配置
  mode: isDev ? 'development' : 'production'
};

export default config;
