use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke_signed;
use anchor_lang::solana_program::system_instruction;

declare_id!("B1NT1eXqBEnidk3kQ874u1h7VvyqBxTc9qfspgh1ef8A");

#[program]
pub mod staking_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, treasury_account: Pubkey) -> Result<()> {
        let state = &mut ctx.accounts.state;

        require!(
            state.treasury_account == Pubkey::default(),
            CustomError::AlreadyInitialized
        );

        state.owner = ctx.accounts.authority.key();
        state.treasury_account = treasury_account;
        state.total_staked = 0;
        state.player_count = 0;

        Ok(())
    }

    pub fn stake(ctx: Context<Stake>, amount: u64) -> Result<()> {
        let state = &mut ctx.accounts.state;
        let player_account = &mut ctx.accounts.player_account;

        // Calculate the required rent
        let required_lamports = Rent::get()?.minimum_balance(PlayerAccount::MAX_SIZE);

        // Check if the player account is new or existing
        if player_account.key == Pubkey::default() {
            // If this is a new player, ensure they're paying enough to cover rent
            require!(
                amount >= required_lamports * 2,
                CustomError::InsufficientStakeForRent
            );

            // Initialize the player account
            player_account.key = ctx.accounts.authority.key();
            player_account.amount = 0; // Initialize amount to zero
            state.player_count += 1;
        } else {
            // If the player account is already initialized, ensure it belongs to the current authority
            require!(
                player_account.key == ctx.accounts.authority.key(),
                CustomError::Unauthorized
            );
        }

        // Transfer SOL from the user to the vault
        let ix = system_instruction::transfer(
            &ctx.accounts.authority.key(),
            &ctx.accounts.vault.key(),
            amount,
        );

        invoke_signed(
            &ix,
            &[
                ctx.accounts.authority.to_account_info(),
                ctx.accounts.vault.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
            &[&[b"vault", &[ctx.bumps.vault]]],
        )?;

        // Update total staked and player's amount
        state.total_staked += amount;
        player_account.amount += amount;

        Ok(())
    }

    pub fn reward(ctx: Context<Reward>, winner: Pubkey) -> Result<()> {
        let state = &mut ctx.accounts.state;

        require!(
            ctx.accounts.authority.key() == state.owner,
            CustomError::Unauthorized
        );

        let treasury_amount = state.total_staked / 10; // 10% to treasury
        let winner_amount = state.total_staked - treasury_amount;

        let ix_treasury = system_instruction::transfer(
            &ctx.accounts.vault.key(),
            &state.treasury_account,
            treasury_amount,
        );
        
        invoke_signed(
            &ix_treasury,
            &[
                ctx.accounts.vault.to_account_info(),
                ctx.accounts.treasury.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
            &[&[b"vault", &[ctx.bumps.vault]]],
        )?;

        let ix_winner = system_instruction::transfer(
            &ctx.accounts.vault.key(),
            &winner,
            winner_amount,
        );
        
        invoke_signed(
            &ix_winner,
            &[
                ctx.accounts.vault.to_account_info(),
                ctx.accounts.winner.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
            &[&[b"vault", &[ctx.bumps.vault]]],
        )?;

        state.total_staked = 0;

        Ok(())
    }

    pub fn reset_state(ctx: Context<ResetState>) -> Result<()> {
        let state = &mut ctx.accounts.state;

        require!(
            ctx.accounts.authority.key() == state.owner,
            CustomError::Unauthorized
        );

        state.total_staked = 0;

        Ok(())
    }

    pub fn close_player_account(ctx: Context<ClosePlayerAccount>) -> Result<()> {
        let state = &mut ctx.accounts.state;
        state.player_count = state.player_count.saturating_sub(1);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
       init,
       payer = authority,
       space = 8 + State::MAX_SIZE,
       seeds = [b"state"],
       bump
    )]
    pub state: Account<'info, State>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Stake<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
       mut,
       seeds = [b"state"],
       bump 
    )]
    pub state: Account<'info, State>,

    #[account(
        mut,
        seeds = [b"vault"],
        bump,
    )]
    pub vault: SystemAccount<'info>,

    #[account(
        init_if_needed,
        payer = authority,
        space = 8 + PlayerAccount::MAX_SIZE,
        seeds = [b"player", authority.key().as_ref()],
        bump
    )]
    pub player_account: Account<'info, PlayerAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Reward<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
       mut,
       seeds = [b"state"],
       bump 
    )]
    pub state: Account<'info, State>,

    #[account(
        mut,
        seeds = [b"vault"],
        bump,
    )]
    pub vault: SystemAccount<'info>,

    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub treasury: AccountInfo<'info>,

    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub winner: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ResetState<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
       mut,
       seeds = [b"state"],
       bump 
    )]
    pub state: Account<'info, State>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ClosePlayerAccount<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [b"state"],
        bump 
    )]
    pub state: Account<'info, State>,

    #[account(
        mut,
        close = authority,
        seeds = [b"player", authority.key().as_ref()],
        bump
    )]
    pub player_account: Account<'info, PlayerAccount>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(Default)]
pub struct State {
    pub owner: Pubkey,
    pub treasury_account: Pubkey,
    pub total_staked: u64,
    pub player_count: u32,
}

impl State {
    pub const MAX_SIZE: usize = 32 + 32 + 8 + 4; // owner + treasury + total_staked + player_count
}

#[account]
pub struct PlayerAccount {
    pub key: Pubkey,
    pub amount: u64,
}

impl PlayerAccount {
    pub const MAX_SIZE: usize = 32 + 8; // key + amount
}

#[error_code]
pub enum CustomError {
    #[msg("The program has already been initialized.")]
    AlreadyInitialized,

    #[msg("You are not authorized to perform this action.")]
    Unauthorized,

    #[msg("There are no stakes available to reward.")]
    NoStakesToReward,

    #[msg("Insufficient stake amount to cover rent for new player account.")]
    InsufficientStakeForRent,
}