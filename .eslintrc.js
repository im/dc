module.exports = {
    'root': true,
    'extends': [
        '@tangxiaomi'
    ],
    env: {
        node: true,
        'vue/setup-compiler-macros': true
    },
    'rules': {
        'vue/valid-v-else': 'off',
        'vue/html-indent': 'off',
        'vue/require-default-prop': 'off',
        'vue/first-attribute-linebreak': 'off',
        'vue/max-attributes-per-line': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'vue/no-multiple-template-root': 'off',
        '@typescript-eslint/indent': [
            'error',
            4
        ]
    }
}