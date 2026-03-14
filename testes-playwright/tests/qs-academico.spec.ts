import { test, expect } from '@playwright/test';

test.describe('QS Acadêmico — Testes do Sistema de Notas', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('1. deve cadastrar aluno com dados válidos', async ({ page }) => {
        await page.getByLabel('Nome do Aluno').fill('João Silva');
        await page.getByLabel('Nota 1').fill('7');
        await page.getByLabel('Nota 2').fill('8');
        await page.getByLabel('Nota 3').fill('6');
        await page.getByRole('button', { name: 'Cadastrar' }).click();
        await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(1);
    });

    test('2. deve exibir mensagem de sucesso após cadastro', async ({ page }) => {
        await page.getByLabel('Nome do Aluno').fill('Ana Costa');
        await page.getByLabel('Nota 1').fill('9');
        await page.getByLabel('Nota 2').fill('8');
        await page.getByLabel('Nota 3').fill('10');
        await page.getByRole('button', { name: 'Cadastrar' }).click();
        await expect(page.locator('#mensagem')).toContainText('cadastrado com sucesso');
    });

    test('3. não deve cadastrar aluno sem nome', async ({ page }) => {
        await page.getByLabel('Nota 1').fill('7');
        await page.getByLabel('Nota 2').fill('8');
        await page.getByLabel('Nota 3').fill('6');
        await page.getByRole('button', { name: 'Cadastrar' }).click();
        await expect(page.getByText('Nenhum aluno cadastrado')).toBeVisible();
    });

    test('4. deve calcular a média aritmética das três notas', async ({ page }) => {
        await page.getByLabel('Nome do Aluno').fill('Aluno Media');
        await page.getByLabel('Nota 1').fill('4');
        await page.getByLabel('Nota 2').fill('6');
        await page.getByLabel('Nota 3').fill('8');
        await page.getByRole('button', { name: 'Cadastrar' }).click();
        const celulaMedia = page.locator('#tabela-alunos tbody tr').first().locator('td').nth(4);
        await expect(celulaMedia).toHaveText('6.00');
    });

    test('5. validacao de notas fora do intervalo', async ({ page }) => {
        await page.getByLabel('Nome do Aluno').fill('Aluno Errado');
        await page.getByLabel('Nota 1').fill('11');
        await page.getByRole('button', { name: 'Cadastrar' }).click();
        await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(0);
    });

    test('6. busca por nome', async ({ page }) => {
        await page.getByLabel('Nome do Aluno').fill('Buscado');
        await page.getByLabel('Nota 1').fill('7');
        await page.getByLabel('Nota 2').fill('7');
        await page.getByLabel('Nota 3').fill('7');
        await page.getByRole('button', { name: 'Cadastrar' }).click();
        await page.getByPlaceholder('Buscar por nome...').fill('Buscado');
        await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(1);
    });

    test('7. exclusao individual de aluno', async ({ page }) => {
        await page.getByLabel('Nome do Aluno').fill('Excluir');
        await page.getByLabel('Nota 1').fill('7');
        await page.getByLabel('Nota 2').fill('7');
        await page.getByLabel('Nota 3').fill('7');
        await page.getByRole('button', { name: 'Cadastrar' }).click();
        await page.locator('.btn-excluir').click();
        await expect(page.getByText('Nenhum aluno cadastrado')).toBeVisible();
    });

    test('8. estatisticas', async ({ page }) => {
        await page.getByLabel('Nome do Aluno').fill('Estatistica');
        await page.getByLabel('Nota 1').fill('7');
        await page.getByLabel('Nota 2').fill('7');
        await page.getByLabel('Nota 3').fill('7');
        await page.getByRole('button', { name: 'Cadastrar' }).click();
        await expect(page.locator('#stat-total')).toHaveText('1');
    });

    test('9. situacao aprovado', async ({ page }) => {
        await page.getByLabel('Nome do Aluno').fill('Aprovado');
        await page.getByLabel('Nota 1').fill('7');
        await page.getByLabel('Nota 2').fill('7');
        await page.getByLabel('Nota 3').fill('7');
        await page.getByRole('button', { name: 'Cadastrar' }).click();
        await expect(page.getByText('Aprovado', { exact: true })).toBeVisible();
    });

    test('10. situacao reprovado', async ({ page }) => {
        await page.getByLabel('Nome do Aluno').fill('Reprovado');
        await page.getByLabel('Nota 1').fill('2');
        await page.getByLabel('Nota 2').fill('2');
        await page.getByLabel('Nota 3').fill('2');
        await page.getByRole('button', { name: 'Cadastrar' }).click();
        await expect(page.getByText('Reprovado')).toBeVisible();
    });

    test('11. situacao recuperacao', async ({ page }) => {
        await page.getByLabel('Nome do Aluno').fill('Recuperacao');
        await page.getByLabel('Nota 1').fill('5');
        await page.getByLabel('Nota 2').fill('6');
        await page.getByLabel('Nota 3').fill('6');
        await page.getByRole('button', { name: 'Cadastrar' }).click();
        await expect(page.getByText('Recuperação')).toBeVisible();
    });

    test('12. multiplos cadastros', async ({ page }) => {
        for (let i = 1; i <= 3; i++) {
            await page.getByLabel('Nome do Aluno').fill(`Aluno ${i}`);
            await page.getByLabel('Nota 1').fill('7');
            await page.getByLabel('Nota 2').fill('7');
            await page.getByLabel('Nota 3').fill('7');
            await page.getByRole('button', { name: 'Cadastrar' }).click();
        }
        await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(3);
    });
});