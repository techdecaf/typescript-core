/* eslint-disable quotes */
/* eslint-disable no-template-curly-in-string */
import yaml from 'js-yaml';
import fs from 'fs';
import { name, main, files, types, repository, scripts } from '../package.json';
import tsconfig from '../tsconfig.json';
import tsbuild from '../tsconfig.build.json';
import huskyrc from '../.huskyrc.json';

const cgen = yaml.safeLoad(
  fs.readFileSync(`${__dirname}/../.cgen.yaml`, 'utf8'),
) as any;

describe('a template generated by cgen: typescript-core', () => {
  describe('given: this project was generated correctly', () => {
    it('then: it then should have some default package.json attributes', async () => {
      expect(name).toEqual(cgen.answers.Name);
      expect(main).toEqual('build/index.js');
      expect(files).toEqual(['build']);
      expect(types).toEqual('build/index.d.ts');
      expect(repository).toEqual({
        type: 'git',
        url: expect.any(String),
      });
      expect(scripts).toEqual({
        build: 'tsc -p tsconfig.build.json',
        ci: 'yarn lint && yarn test:coverage && test:e2e',
        lint: `eslint "**/*.ts" --fix --ignore-path .gitignore`,
        test: 'yarn lint && jest',
        'test:coverage': "jest --coverage --globals '{}'",
        'test:debug':
          'node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand',
        'test:e2e': "echo 'no e2e tests configured'",
        'test:watch': 'jest --watch',
      });
    });

    it('then: husky should be configured to run hooks', async () => {
      expect(huskyrc).toEqual({
        hooks: {
          'pre-commit': 'yarn lint && yarn test:coverage',
          'pre-push': 'yarn test:e2e',
        },
      });
    });

    it('then: tsconfig is configured correctly using best practices', async () => {
      expect(tsconfig).toEqual({
        compilerOptions: {
          allowSyntheticDefaultImports: true,
          alwaysStrict: true,
          declaration: true,
          emitDecoratorMetadata: true,
          esModuleInterop: true,
          experimentalDecorators: true,
          inlineSourceMap: true,
          inlineSources: true,
          lib: ['ES2020'],
          module: 'commonjs',
          moduleResolution: 'node',
          noFallthroughCasesInSwitch: false,
          outDir: 'build',
          preserveConstEnums: true,
          resolveJsonModule: true,
          skipLibCheck: true,
          strict: true,
          strictPropertyInitialization: false,
          target: 'ES2020',
        },
        exclude: ['node_modules', 'build'],
        include: ['src/**/*'],
      });
    });

    it('then: tsconfig is configured correctly using best practices', async () => {
      expect(tsbuild).toEqual({
        extends: './tsconfig.json',
        exclude: [
          'node_modules',
          'src/**/*.test.ts',
          'src/**/*.spec.ts',
          'build',
        ],
      });
    });

    it('then: .eslintrc.yaml is configured with best practices', async () => {
      const eslintrc = yaml.safeLoad(
        fs.readFileSync(`${__dirname}/../.eslintrc.yaml`, 'utf8'),
      ) as any;

      expect(eslintrc).toEqual({
        env: { es6: true, jest: true, node: true },
        extends: [
          'eslint:recommended',
          'plugin:@typescript-eslint/eslint-recommended',
          'plugin:@typescript-eslint/recommended',
          'airbnb-base',
          'prettier',
        ],
        overrides: [
          {
            files: ['*.test.ts', '*.spec.ts'],
            rules: {
              '@typescript-eslint/no-explicit-any': 'off',
              'import/no-extraneous-dependencies': 'off',
            },
          },
        ],
        parser: '@typescript-eslint/parser',
        parserOptions: { ecmaVersion: 9, sourceType: 'module' },
        plugins: ['@typescript-eslint'],
        rules: {
          'class-methods-use-this': 0,
          'import/extensions': ['error', { json: 'always', ts: 'never' }],
          'import/prefer-default-export': 0,
          indent: ['warn', 2],
          'max-len': [
            'error',
            {
              ignoreComments: true,
              ignoreStrings: true,
              ignoreTemplateLiterals: true,
            },
          ],
          'no-console': 'warn',
          'no-empty-function': 0,
          'no-useless-constructor': 0,
          quotes: ['error', 'single'],
        },
        settings: {
          'import/resolver': {
            node: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
          },
        },
      });
    });
  });
});
